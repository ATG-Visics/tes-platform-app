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
  DynamicAPIContext,
  FORM_STATUS,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useSubmitHandler,
  WeldingContext,
} from '@tes/utils-hooks';
import {
  IPersonSampleSubject,
  IPersonSampleSubjectPayload,
  useCreatePersonSampleSubjectMutation,
} from '@tes/person-subject-api';

import {
  useGetAllMetalQuery,
  useGetAllSegQuery,
} from '@tes/static-dropdown-data';
import { schema, uiSchema } from './Schemas';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { TransitionsModal } from '@tes/ui/core';
import { FormTheme } from '@tes/ui/form';
import { DYNAMIC_FORM_STATUS, useSetApiDataInSchema } from '../../hooks';
import { Close as CloseIcon } from '@mui/icons-material';
import { useOutletContext, useParams } from 'react-router-dom';
import { useCustomNavigate } from '@tes/router';
import {
  samplingPlanRenderers,
  useGetSamplingPlanByIdQuery,
} from '@tes/sampling-plan';
import { produce } from 'immer';

interface ISubjectForm extends IPersonSampleSubjectPayload {
  whichSubject: string;
  samplingPlan: string | null;
  useSamplingPlan: string;
}

export function PersonSubjectCreatePage() {
  const { surveyMoment } = useOutletContext<{
    surveyMoment: {
      project: string;
      startDate: string;
    };
  }>();
  const { id = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const [open, setOpen] = useState<boolean>(true);
  const [data, setData] = useState<Partial<ISubjectForm>>({
    whichSubject: 'person',
    useSamplingPlan: 'samplingPlan',
  });

  const { jsonformProps: baseJsonformProps, formStatus } = useForm<
    ISubjectForm,
    IPersonSampleSubject
  >({
    schema,
    uischema: uiSchema,
    recordStatus: RECORD_STATUS.SUCCEEDED,
    isNewRecord: true,
    data,
    setData,
    extraRenderers: [...extraRenderers, ...samplingPlanRenderers],
  });

  const { jsonformProps, dynamicFormStatus } = useSetApiDataInSchema({
    baseJsonformProps,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      navigateToRoute(`surveyDashboard`, { params: { id } });
    },
    [id, navigateToRoute],
  );

  const { submissionStatus, submitHandler, submissionError } = useSubmitHandler(
    {
      isNewRecord: true,
      data: {
        ...data,
        surveyMoment: surveyMoment,
        chemicals: false,
      },
      recordId: '',
      submitSuccessHandler,
      useCreateMutation: useCreatePersonSampleSubjectMutation,
    },
  );

  const onFormPreSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setOpen(true);
      submitHandler();
    },
    [submitHandler],
  );

  const { data: samplingPlanData } = useGetSamplingPlanByIdQuery(
    data.samplingPlan ?? '',
    {
      skip: !data.samplingPlan,
    },
  );

  useEffect(() => {
    if (samplingPlanData && data.useSamplingPlan === 'samplingPlan') {
      setData(
        produce((draft) => {
          draft.jobTitle = samplingPlanData.jobTitle;
          draft.shiftLength = samplingPlanData.shiftLength;
        }),
      );
    }
  }, [data.useSamplingPlan, samplingPlanData]);

  useEffect(() => {
    if (data.useSamplingPlan === 'noSamplingPlan') {
      setData(
        produce((draft) => {
          draft.samplingPlan = null;
        }),
      );
    }
  }, [data.useSamplingPlan, samplingPlanData]);

  const hasFormErrors = useMemo(() => {
    return (
      !data.title || !data.employeeNumber || !data.jobTitle || !data.shiftLength
    );
  }, [data?.employeeNumber, data?.jobTitle, data?.shiftLength, data?.title]);

  return (
    <>
      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          errorList={
            submissionError?.data as unknown as {
              [key: string]: [string];
            }
          }
          showButton
          open={open}
          handleClose={() => {
            setOpen(false);
          }}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {formStatus === FORM_STATUS.SUCCEEDED &&
        jsonformProps &&
        dynamicFormStatus === DYNAMIC_FORM_STATUS.SUCCEEDED && (
          <Modal
            open={true}
            onClose={(_event, reason) => {
              if (reason === 'escapeKeyDown') {
                navigateToRoute(`surveyDashboard`, { params: { id } });
              }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ height: '100%', maxHeight: '100%' }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'calc(100% - 32px)',
                maxWidth: '1080px',
                height: 'calc(100% - 64px)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                overflow: 'auto',
              }}
            >
              <AppBar color="secondary" elevation={0} position="sticky">
                <Toolbar
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="h5" color="#fff">
                    Add sample subject
                  </Typography>
                  <IconButton
                    onClick={() =>
                      navigateToRoute(`surveyDashboard`, { params: { id } })
                    }
                  >
                    <CloseIcon sx={{ fill: '#fff' }} />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Box sx={{ mx: 4, mb: 2 }}>
                <WeldingContext.Provider
                  value={{ useGetAllQuery: useGetAllMetalQuery }}
                >
                  <form
                    onSubmit={(event) => {
                      onFormPreSubmit(event);
                      setOpen(true);
                    }}
                  >
                    <DynamicAPIContext.Provider
                      value={{ useGetAllQuery: useGetAllSegQuery }}
                    >
                      <FormTheme>
                        <JsonForms {...jsonformProps} />
                      </FormTheme>
                    </DynamicAPIContext.Provider>
                    <Box
                      mt={3}
                      sx={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={hasFormErrors}
                      >
                        Create new Person Subject
                      </Button>
                    </Box>
                  </form>
                </WeldingContext.Provider>
              </Box>
            </Box>
          </Modal>
        )}
    </>
  );
}
