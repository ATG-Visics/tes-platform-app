import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  FORM_STATUS,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import {
  ISample,
  useGetSampleByIdQuery,
  useStopSampleMutation,
  useUpdateSampleMutation,
} from '../../api';
import { schema, uiSchema } from './Schemas';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import { FormTheme } from '@tes/ui/form';
import { Close as CloseIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useCustomNavigate } from '@tes/router';
import dayjs from 'dayjs';

export function SampleFinishPage() {
  const { sampleId = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const [data, setData] = useState<Partial<ISample & { isChemical: boolean }>>({
    isChemical: false,
  });
  const [open, setOpen] = useState<boolean>(true);
  const [stopSample] = useStopSampleMutation();

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

  const { jsonformProps, formStatus } = useForm({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord: !sampleId,
    data,
    setData,
    extraRenderers,
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

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: !sampleId,
    data: {
      id: record?.id,
      sampleId: record?.sampleId,
      hazards: hazardList,
      instrument: { id: data?.instrument?.id, title: '' },
      medium: { id: data?.medium?.id, title: '' },
      calibratedWith: { id: data?.calibratedWith?.id, title: '' },
      finalFlowRate: data?.finalFlowRate,
      surveyMoment: data.surveyMoment,
      sampler: data.sampler,
    },
    recordId: sampleId,
    submitSuccessHandler,
    useUpdateMutation: useUpdateSampleMutation,
  });

  const handleSubmitFinish = (e: React.FormEvent) => {
    const formattedTime = dayjs().utc().format('HH:mm:ss');
    stopSample({
      uuid: sampleId,
      body: { endTime: formattedTime },
    });
    onFormSubmit(e);
  };

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

      {formStatus === FORM_STATUS.SUCCEEDED && jsonformProps && (
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
              <Toolbar
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography variant="h5" color="#fff">
                  Finish sample #{record?.sampleId}
                </Typography>
                <IconButton onClick={() => navigateToRoute('sampleDetail')}>
                  <CloseIcon sx={{ fill: '#fff' }} />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Box mb={6} />
            <form onSubmit={(e) => handleSubmitFinish(e)}>
              <FormTheme>
                <JsonForms {...jsonformProps} />
              </FormTheme>
              <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained">
                  Finish
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )}
    </>
  );
}
