import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import {
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon,
  FileDownload as FileDownloadIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Button } from '@tes/ui/core';
import { ISampleListItem, sampleActions, SampleListItem } from '@tes/samples';
import { useCallback, useMemo } from 'react';
import { useCustomNavigate } from '@tes/router';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IPersonSampleSubject } from '@tes/person-subject-api';
import { IAreaSampleSubject } from '@tes/area-subject-api';

interface IProps<T> {
  emptyMessage: string;
  isClient: boolean;
  subjectList: Partial<T>;
  surveyMomentId: {
    project: string;
    startDate: string;
  };
  handleDownloadPdf: (id: string, path: string, fileName: string) => void;
}

const softRequiredAreaFields: (keyof IAreaSampleSubject)[] = [
  'workEnvironment',
  'ventilation',
  'weldingProcess',
  'samplingConditions',
  'unusualConditions',
];

const softRequiredPersonFields: (keyof IPersonSampleSubject)[] = [
  'workEnvironment',
  'ventilation',
  'weldingProcess',
  'samplingConditions',
  'unusualConditions',
  // Person specific
  'exposureControls',
  // Person PPE
  'clothing',
  'respirator',
  'gloves',
  'boots',
  'eyeWear',
  'hearingProtection',
  'headProtection',
];

export function AreaSampleSubjectListItem<
  T extends
    | Array<{
        id: string;
        title: string;
        samples?: Array<ISampleListItem>;
        seg?: string;
        employeeNumber?: string;
      }>
    | undefined,
>(props: IProps<T>) {
  const {
    emptyMessage,
    subjectList,
    isClient,
    handleDownloadPdf,
    surveyMomentId,
  } = props;
  const { navigateToRoute } = useCustomNavigate();
  const { id = '' } = useParams();
  const dispatch = useDispatch();

  const formattedDate = useMemo(
    () => dayjs(surveyMomentId.startDate).format('MMM DD YYYY, hh-mm a'),
    [surveyMomentId],
  );

  const handleCreateSample = useCallback(
    (samplingPlan: string, subjectType: string, subjectId: string) => {
      dispatch(
        sampleActions.updatedUsedSamplingPlan({
          usedSamplingPlan: samplingPlan,
        }),
      );

      navigateToRoute('sampleCreate', {
        params: { id, subjectType, subjectId: subjectId },
      });
    },
    [dispatch, id, navigateToRoute],
  );

  if (!subjectList) {
    return (
      <List>
        <ListItem>
          <ListItemText primary={emptyMessage} />
        </ListItem>
      </List>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {Array.isArray(subjectList) &&
        subjectList.map((subject) => {
          const subjectType = subject.employeeNumber ? 'person' : 'area';

          const softRequiredFields =
            subjectType === 'person'
              ? softRequiredPersonFields
              : softRequiredAreaFields;

          const hasMissingSoftRequiredFields = softRequiredFields.some(
            (field) => {
              const value = subject[field];
              return (
                value === undefined ||
                value === null ||
                (Array.isArray(value) && value.length === 0)
              );
            },
          );

          return (
            <Card
              key={subject.id}
              sx={{ mb: 4, width: '100%', backgroundColor: '#EBEBEB' }}
            >
              <CardHeader
                sx={
                  hasMissingSoftRequiredFields
                    ? { backgroundColor: '#ffad33', color: 'white' }
                    : { backgroundColor: '#fff' }
                }
                action={
                  !isClient && (
                    <IconButton
                      onClick={() =>
                        navigateToRoute(
                          subjectType === 'person'
                            ? 'subjectPersonUpdate'
                            : 'subjectAreaUpdate',
                          {
                            params: {
                              id,
                              subjectId: subject.id,
                            },
                          },
                        )
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  )
                }
                title={
                  <Box sx={{ display: 'flex', flexFlow: 'column' }}>
                    {hasMissingSoftRequiredFields && (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <WarningIcon sx={{ mr: 2 }} />
                        <Typography fontWeight="bold">
                          Not all data is filled in.
                        </Typography>
                      </Box>
                    )}
                    <Box>
                      <IconButton
                        onClick={() =>
                          handleDownloadPdf(
                            subject.id,
                            subjectType,
                            `${formattedDate} -- ${subject.title}`,
                          )
                        }
                        sx={{ mr: 2 }}
                      >
                        <FileDownloadIcon />
                      </IconButton>
                      <Button
                        sx={{
                          color: '#000',
                          fontSize: '1.25rem',
                          textTransform: 'None',
                        }}
                        onClick={() =>
                          navigateToRoute(
                            subjectType === 'person'
                              ? 'subjectPersonDetail'
                              : 'subjectAreaDetail',
                            {
                              params: {
                                id,
                                subjectId: subject.id,
                              },
                            },
                          )
                        }
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            display: 'flex',
                            flexFlow: 'row nowrap',
                            alignItems: 'center',
                          }}
                        >
                          {subject.employeeNumber
                            ? `#${subject.employeeNumber} | `
                            : ''}
                          {subject.title}
                          <ArrowForwardIcon />
                        </Typography>
                      </Button>
                    </Box>
                  </Box>
                }
              />
              <CardContent
                sx={{
                  py: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  flexFlow: 'column',
                }}
              >
                {!isClient && (
                  <Button
                    sx={{ mt: 2, mx: 'auto' }}
                    variant="contained"
                    onClick={() =>
                      handleCreateSample(
                        subject.samplingPlan,
                        subjectType,
                        subject.id,
                      )
                    }
                  >
                    Add sample
                  </Button>
                )}
                {subject.samples ? (
                  subject.samples.map((subItem: ISampleListItem) => (
                    <SampleListItem
                      key={subItem.id}
                      item={subItem}
                      subjectType={subjectType}
                      subjectId={subject.id}
                    />
                  ))
                ) : (
                  <Typography sx={{ mt: 2 }} textAlign="center" variant="body1">
                    No samples found
                  </Typography>
                )}
              </CardContent>
            </Card>
          );
        })}
    </List>
  );
}
