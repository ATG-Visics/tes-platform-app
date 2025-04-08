import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  ListItem,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import {
  ISample,
  useGetSampleByIdQuery,
  useUpdateSampleMutation,
} from '../../api';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import { Close as CloseIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useCustomNavigate } from '@tes/router';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import {
  IAreaSubjectListItem,
  useGetAllAreaSampleSubjectQuery,
} from '@tes/area-subject-api';
import {
  IPersonSampleSubjectListItem,
  useGetAllPersonSampleSubjectQuery,
} from '@tes/person-subject-api';

export function MoveSamplePage() {
  const { sampleId = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const [data, setData] = useState<Partial<ISample & { isChemical: boolean }>>({
    isChemical: false,
  });
  const [open, setOpen] = useState<boolean>(true);

  const currentDate = new Date();
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(currentDate));

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [areaSubjects, setAreaSubjects] = useState<IAreaSubjectListItem[]>([]);
  const [personSubjects, setPersonSubjects] = useState<
    IPersonSampleSubjectListItem[]
  >([]);

  const { data: areaSubjectsData } = useGetAllAreaSampleSubjectQuery({
    surveyMomentId: {
      project: data?.surveyMoment?.project || '',
      startDate: value?.format('YYYY-MM-DD') || '',
    },
  });

  const { data: personSubjectsData } = useGetAllPersonSampleSubjectQuery({
    surveyMomentId: {
      project: data?.surveyMoment?.project || '',
      startDate: value?.format('YYYY-MM-DD') || '',
    },
  });

  useEffect(() => {
    if (areaSubjectsData) {
      setAreaSubjects(areaSubjectsData.results);
    }
  }, [areaSubjectsData]);

  useEffect(() => {
    if (personSubjectsData) {
      setPersonSubjects(personSubjectsData.results);
    }
  }, [personSubjectsData]);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSubject(event.target.value);
  };

  const hazardList = useMemo(() => {
    if (!data.hazards) {
      return [];
    }

    return data.hazards.map((item) =>
      typeof item === 'string' ? item : item.id,
    );
  }, [data?.hazards]);

  const { record, recordStatus } = useRecord({
    givenId: sampleId,
    useRecordQuery: useGetSampleByIdQuery,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      setData({});
      navigateToRoute('sampleDetail');
    },
    [navigateToRoute],
  );

  const selectedSubjectType = areaSubjects.find(
    (areaSubject) => areaSubject.id === selectedSubject,
  )
    ? 'area'
    : 'person';

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: !sampleId,
    data: {
      id: record?.id,
      sampleId: record?.sampleId,
      hazards: hazardList,
      areaSampleSubject:
        selectedSubjectType === 'area'
          ? selectedSubject ?? undefined
          : undefined,
      personSampleSubject:
        selectedSubjectType === 'person'
          ? selectedSubject ?? undefined
          : undefined,
      instrument: { id: data?.instrument?.id, title: '' },
      medium: { id: data?.medium?.id, title: '' },
      calibratedWith: { id: data?.calibratedWith?.id, title: '' },
      finalFlowRate: data?.finalFlowRate,
      surveyMoment: {
        startDate: value?.format('YYYY-MM-DD') || '',
        project: data.surveyMoment?.project || '',
      },
      sampler: data.sampler,
    },
    recordId: sampleId,
    submitSuccessHandler,
    useUpdateMutation: useUpdateSampleMutation,
  });

  useEffect(() => {
    if (recordStatus !== RECORD_STATUS.SUCCEEDED) {
      return;
    }

    if (!record) {
      return;
    }

    setData({
      ...record,
      isChemical: record.instrument.model.instrumentType === 'chemical',
    });
  }, [record, recordStatus]);

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}

      {recordStatus === RECORD_STATUS.LOADING && (
        <Box
          sx={{
            position: 'fixed',
            top: 'calc(50% - 48px)',
            left: 'calc(50% - 48px)',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          errorList={submissionError?.data as { [key: string]: [string] }}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      <Modal
        open={true}
        onClose={(_event, reason) => {
          if (reason === 'escapeKeyDown') {
            navigateToRoute('sampleDetail');
          }
        }}
        aria-labelledby={`${record?.sampleId}-modal-title`}
        aria-describedby={`${record?.sampleId}-modal-description`}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '720px',
            height: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
          }}
        >
          <AppBar color="secondary" elevation={0}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" color="#fff">
                Move sample #{record?.sampleId}
              </Typography>
              <IconButton onClick={() => navigateToRoute('sampleDetail')}>
                <CloseIcon sx={{ fill: '#fff' }} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box mb={6} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <RadioGroup value={selectedSubject} onChange={handleSubjectChange}>
            {areaSubjects.length > 0 && (
              <>
                <Typography variant="h6" color="textSecondary">
                  Area Subjects
                </Typography>

                {areaSubjects.map((subject) => (
                  <ListItem key={subject.id}>
                    <FormControlLabel
                      value={subject.id}
                      control={<Radio />}
                      label={subject.title}
                    />
                  </ListItem>
                ))}
              </>
            )}
            {personSubjects.length > 0 && (
              <>
                <Typography variant="h6">Person Subjects</Typography>

                {personSubjects.map((subject) => (
                  <ListItem key={subject.id}>
                    <FormControlLabel
                      value={subject.id}
                      control={<Radio />}
                      label={subject.title}
                    />
                  </ListItem>
                ))}
              </>
            )}
          </RadioGroup>
          <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" onClick={onFormSubmit}>
              Move Sample
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
