import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ISamplingPlanListResponse,
  useGetAllSamplingPlansQuery,
  useGetSamplingPlanByIdQuery,
} from '../api';
import { useCustomNavigate } from '@tes/router';
import { mapListResult, useDebounce, useRecord } from '@tes/utils-hooks';
import { useGetPersonSubjectByIdQuery } from '@tes/person-subject-api';
import { useGetAreaSubjectByIdQuery } from '@tes/area-subject-api';
import { CrudListPageToolbar } from '@tes/crud';

export const SamplingPlanSelectControl = (
  props: ControlProps & OwnPropsOfEnum,
) => {
  const { path, handleChange, data, visible } = props;
  const { id = '', subjectId = '', subjectType = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const { record: personSubjectRecord } = useRecord({
    givenId: subjectId,
    useRecordQuery: useGetPersonSubjectByIdQuery,
    skip: subjectType !== 'person',
  });

  const { record: areaSubjectRecord } = useRecord({
    givenId: subjectId,
    useRecordQuery: useGetAreaSubjectByIdQuery,
    skip: subjectType !== 'area',
  });

  const subject = personSubjectRecord || areaSubjectRecord;
  const {
    data: apiData,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllSamplingPlansQuery(
    {
      project: id,
      search: debouncedSearch,
      filterParams: {
        job_title: subject?.jobTitle || '',
        subject_type: subjectType,
      },
    },
    { skip: data },
  );

  const { data: oneSamplingPlan, isSuccess } = useGetSamplingPlanByIdQuery(
    data,
    { skip: !data },
  );

  const { itemList, itemCount } = mapListResult(apiData);

  const [displaySamplingPlans, setDisplaySamplingPlans] =
    useState<Partial<ISamplingPlanListResponse> | null>();

  useEffect(() => {
    if (data === null) {
      setDisplaySamplingPlans(null);
    }
  }, [data]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    if (!oneSamplingPlan) {
      return;
    }

    setDisplaySamplingPlans(oneSamplingPlan);
  }, [isSuccess, oneSamplingPlan]);

  const handleSelectSamplingPlan = (
    samplingPlan: ISamplingPlanListResponse,
  ) => {
    setDisplaySamplingPlans(samplingPlan);
    handleChange(path, samplingPlan.id);
  };

  const handleCreateSamplingPlan = () => {
    navigateToRoute('samplingPlanCreate', { params: { id } });
  };

  const handleDeleteSamplingPlan = useCallback(() => {
    handleChange(path, null);
    setDisplaySamplingPlans(null);
    refetch();
  }, [handleChange, path, refetch]);

  if (!visible) {
    return null;
  }

  if (displaySamplingPlans && displaySamplingPlans.title) {
    return (
      <Box
        sx={{
          my: 3,
          px: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" mb={1}>
            {displaySamplingPlans.title}
          </Typography>
          {displaySamplingPlans.shiftLength && (
            <Typography>
              <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>
                Shiftlength:
              </Typography>
              {displaySamplingPlans.shiftLength}
            </Typography>
          )}
          {displaySamplingPlans.jobTitle && (
            <Typography>
              <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>
                Job title:
              </Typography>
              {displaySamplingPlans.jobTitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleDeleteSamplingPlan}>
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  }

  if (isError || itemCount === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          m: 2,
        }}
      >
        <Typography>
          No sampling plan scenario available for the selected subject.
        </Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="secondary"
          onClick={handleCreateSamplingPlan}
        >
          Create a scenario
        </Button>
      </Box>
    );
  }

  return (
    <Paper sx={{ mb: 3, p: 2 }}>
      <CrudListPageToolbar
        title="Sample scenario selection"
        addLabel=""
        searchFieldPlaceholder="Search for sample scenario"
        searchValue={search}
        onSearchChange={(event) => setSearch(event.target.value)}
        onAddClick={() => void [0]}
        showAddButton={false}
      />

      {(isFetching || isLoading) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <List sx={{ width: '100%', mt: 3 }}>
        {itemList.map((samplingPlan) => (
          <Fragment key={samplingPlan.id}>
            <ListItem
              alignItems="flex-start"
              onClick={() => handleSelectSamplingPlan(samplingPlan)}
              sx={{
                cursor: 'pointer',
                flexDirection: 'column',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(0 0 0 / 4%)',
                },
              }}
            >
              <ListItemText
                primary={samplingPlan.title}
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    {samplingPlan.sampleType}
                  </Typography>
                }
              />

              <ListItemText
                sx={{
                  textAlign: 'right',
                }}
                primary={
                  <Box>
                    {samplingPlan.hazardScenarios.map((hazardScenario) => (
                      <Chip
                        key={hazardScenario.hazard.id}
                        label={hazardScenario.hazard.title}
                        size="small"
                        sx={{ my: '2px', mr: '2px' }}
                      />
                    ))}
                  </Box>
                }
              />
            </ListItem>
            <Divider component="li" />
          </Fragment>
        ))}
      </List>
    </Paper>
  );
};

export const SamplingPlanSelectControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('SamplingPlanSelectControl'),
);

export const SamplingPlanSelectControlRenderer = withJsonFormsControlProps(
  SamplingPlanSelectControl,
);
