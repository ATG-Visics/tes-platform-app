import {
  FORM_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import { schema, uiSchema } from './schemas';
import { useCallback, useEffect, useState } from 'react';
import {
  INoiseResultPayload,
  useCreateNoiseResultMutation,
  useGetNoiseResultByIdQuery,
  useGetSampleByIdQuery,
  useUpdateNoiseResultMutation,
} from '../../../api';
import { useParams } from 'react-router-dom';
import { TransitionsModal } from '@tes/ui/core';
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
import { Close as CloseIcon } from '@mui/icons-material';
import { FormTheme } from '@tes/ui/form';
import { JsonForms } from '@jsonforms/react';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useCustomNavigate } from '@tes/router';
import { useDynamicNoiseResultFormHooks } from '../../../hooks/useDynamicNoiseResultForm.hooks';
import { uiSchemaHeader } from '../../ChemSampleResultCreatePage/schemas/uiSchema';

export function NoiseCreateResultPage() {
  const { id = '', sampleId = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const [open, setOpen] = useState<boolean>(true);
  const { recordId, record, recordStatus } = useRecord({
    givenId: sampleId,
    useRecordQuery: useGetSampleByIdQuery,
  });

  const noiseResponse = useGetNoiseResultByIdQuery(recordId || '');
  const noiseHazardData = noiseResponse.data;

  const [data, setData] = useState<Partial<INoiseResultPayload>>({
    sample: recordId,
    hazard: record?.hazards[0].id,
  });

  const { jsonformProps: baseJsonformProps, formStatus } = useForm({
    schema: schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord: true,
    data,
    setData,
    extraRenderers,
  });

  useEffect(() => {
    if (!noiseHazardData) {
      return;
    }

    setData((prevState) => ({
      ...prevState,
      ...noiseHazardData,
    }));
  }, [noiseHazardData]);

  const { jsonformProps } = useDynamicNoiseResultFormHooks({
    schema: schema,
    setData,
    baseJsonformProps,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      navigateToRoute('surveyDashboard', { params: { id } });
    },
    [id, navigateToRoute],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: !noiseHazardData,
    data: {
      ...data,
      sample: recordId,
      hazard: record?.hazards[0].id,
    },
    recordId: noiseHazardData?.id ? noiseHazardData.id : '',
    submitSuccessHandler,
    useCreateMutation: useCreateNoiseResultMutation,
    useUpdateMutation: useUpdateNoiseResultMutation,
  });

  return (
    <>
      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          errorList={
            submissionError?.data as
              | { [key: string]: [string] }
              | null
              | undefined
          }
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
              navigateToRoute('surveyDashboard', { params: { id } });
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
              maxWidth: '1024px',
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
                  Sample result #{record?.sampleId}
                </Typography>
                <IconButton
                  onClick={() =>
                    navigateToRoute('surveyDashboard', { params: { id } })
                  }
                >
                  <CloseIcon sx={{ fill: '#fff' }} />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Box mb={6} />
            <form
              onSubmit={(event) => {
                onFormSubmit(event);
                setOpen(true);
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography align="center" variant="h4">
                  Noise
                </Typography>
                {jsonformProps && (
                  <Box>
                    <FormTheme>
                      <JsonForms {...jsonformProps} uischema={uiSchemaHeader} />
                    </FormTheme>
                  </Box>
                )}
              </Box>
              {jsonformProps ? (
                <>
                  <FormTheme>
                    <JsonForms {...jsonformProps} />
                  </FormTheme>
                  <Box
                    mt={3}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button type="submit" variant="contained">
                      Finish
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress />
                </Box>
              )}
            </form>
          </Box>
        </Modal>
      )}
    </>
  );
}
