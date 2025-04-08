import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  DynamicAPIContext,
  FORM_STATUS,
  HazardsContext,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import {
  ISampleListItemPayload,
  useCreateSampleMutation,
  useGetAllHazardsQuery,
  useGetAllSampleMediaStaticQuery,
  useGetSampleByIdQuery,
  useUpdateSampleMutation,
} from '../../api';
import { schema, uiSchema } from './Schemas';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { TransitionsModal } from '@tes/ui/core';
import { FormTheme } from '@tes/ui/form';
import { useDynamicFormElements } from '../../hooks';
import {
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sampleActions } from '../../sample.slice';
import { produce } from 'immer';
import { extraRenderers } from '@tes/jsonforms-extensions';
import * as colors from '@tes/ui/colors';
import { useGetAllInstrumentsQuery } from '@tes/instruments';
import { useGetAllCalibrationDevicesQuery } from '@tes/calibration';
import {
  samplingPlanRenderers,
  useGetSamplingPlanByIdQuery,
} from '@tes/sampling-plan';
import { useCustomNavigate } from '@tes/router';
import { fullUserName } from '@tes/accounts';

export function SampleCreatePage() {
  const { surveyMoment } = useOutletContext<{
    surveyMoment: {
      project: string;
      startDate: string;
    };
  }>();
  const dispatch = useDispatch();
  const { updateNeedsRefetch } = sampleActions;

  const {
    id = '',
    subjectId = '',
    subjectType = '',
    sampleId = '',
  } = useParams();
  const { navigateToRoute } = useCustomNavigate();

  const fullName = useSelector(fullUserName);
  const [data, setData] = useState<
    Partial<
      ISampleListItemPayload & {
        chemical: boolean;
        hazardScenarios: {
          hazard: {
            id: string;
            title: string;
          };
          selected?: boolean;
        }[];
        useSamplingPlan: 'samplingPlan' | 'noSamplingPlan';
      }
    >
  >({ useSamplingPlan: 'samplingPlan' });
  const [open, setOpen] = useState<boolean>(true);

  const { record, recordStatus, isNewRecord } = useRecord({
    givenId: sampleId,
    useRecordQuery: useGetSampleByIdQuery,
  });

  const hasSamplingPlan = data.samplingPlan;

  const {
    data: samplingPlanData,
    isSuccess,
    refetch,
  } = useGetSamplingPlanByIdQuery(data.samplingPlan ?? '', {
    skip: !data.samplingPlan,
  });

  const {
    jsonformProps: baseJsonformProps,
    formStatus,
    hasFormErrors,
  } = useForm({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord,
    record,
    data,
    setData,
    extraRenderers: [...extraRenderers, ...samplingPlanRenderers],
  });

  useEffect(() => {
    if (formStatus !== FORM_STATUS.SUCCEEDED) {
      return;
    }

    if (data?.hazardScenarios && data?.hazardScenarios?.length > 0) {
      setData((prevState) => {
        return {
          ...prevState,
          hazards: prevState.hazardScenarios?.reduce(
            (filtered: string[], scenario) => {
              if (scenario.selected) {
                filtered.push(scenario.hazard as unknown as string);
              }
              return filtered;
            },
            [],
          ),
        };
      });
    }
  }, [data?.hazardScenarios, formStatus]);

  useEffect(() => {
    if (!isSuccess || !hasSamplingPlan) {
      setData(
        produce((draft) => {
          draft.sampler = fullName;
        }),
      );
      return;
    }

    if (
      hasSamplingPlan &&
      isSuccess &&
      data.useSamplingPlan === 'samplingPlan'
    ) {
      setData(
        produce((draft) => {
          draft.sampler = fullName;
          draft.samplingPlan = samplingPlanData.id;
          draft.type = samplingPlanData.sampleType;
          draft.medium = samplingPlanData.media;
          draft.hazards = samplingPlanData.hazardScenarios.reduce(
            (filtered: string[], scenario) => {
              if (scenario.selected) {
                filtered.push(scenario.hazard as unknown as string);
              }
              return filtered;
            },
            [],
          );
          draft.hazardScenarios = samplingPlanData.hazardScenarios.map(
            (hazardScenario) => ({
              hazard: hazardScenario.hazard,
              oelSource: hazardScenario.oelSource,
              oel: hazardScenario.oel,
              actionLevelSource: hazardScenario.actionLevelSource,
              actionLevel: hazardScenario.actionLevel,
              remainingSampleCount: hazardScenario.remainingSampleCount,
              targetSampleCount: hazardScenario.targetSampleCount,
              selected: true,
            }),
          );
        }),
      );
    }
  }, [
    data.useSamplingPlan,
    fullName,
    hasSamplingPlan,
    isSuccess,
    samplingPlanData,
  ]);

  useEffect(() => {
    if (!subjectId) {
      return;
    }

    if (!surveyMoment) {
      return;
    }

    if (subjectType === 'person') {
      setData((prevState) => ({
        ...prevState,
        surveyMoment: surveyMoment,
        personSampleSubject: subjectId,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        surveyMoment: surveyMoment,
        areaSampleSubject: subjectId,
      }));
    }
  }, [subjectType, subjectId, surveyMoment]);

  const { jsonformProps } = useDynamicFormElements({
    baseJsonformProps,
    setData,
    data,
    record,
    formStatus,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      setData({});
      refetch();
      navigateToRoute('surveyDashboard', { params: { id } });
      dispatch(updateNeedsRefetch({ needsRefetch: true }));
    },
    [dispatch, id, navigateToRoute, refetch, updateNeedsRefetch],
  );

  const instrumentType = useMemo(() => {
    if (!data.instrument) {
      return undefined;
    }

    if (!data.instrument?.id.includes('|')) {
      return record && record.instrument.model.instrumentType;
    }

    return data.instrument?.id.split('|')[1].trim();
  }, [data.instrument, record]);

  useEffect(() => {
    if (!instrumentType) {
      return;
    }

    setData((prevState) => ({
      ...prevState,
      chemical: instrumentType === 'chemical',
      twaCalculationMethod: record?.twaCalculationMethod?.id,
    }));
  }, [instrumentType, record?.twaCalculationMethod?.id]);

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: !sampleId,
    data,
    recordId: sampleId,
    submitSuccessHandler,
    useCreateMutation: useCreateSampleMutation,
    useUpdateMutation: useUpdateSampleMutation,
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (closeModal: boolean) => {
    setOpenAlert(false);

    if (closeModal) {
      navigateToRoute('surveyDashboard', { params: { id } });
    }
  };

  return (
    <>
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
          errorList={
            submissionError?.data as { [key: string]: [string] } | null
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
              handleClickOpenAlert();
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
              maxWidth: '900px',
              height: 'calc(100% - 24px)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              overflow: 'auto',
            }}
          >
            <AppBar color="secondary" elevation={0} position="sticky">
              <Toolbar
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Button
                  onClick={() =>
                    navigateToRoute('surveyDashboard', { params: { id } })
                  }
                  sx={{ pl: 0, textTransform: 'none' }}
                >
                  <ChevronLeftIcon sx={{ color: '#fff' }} />
                  <Typography variant="h5" color="#fff">
                    {!sampleId ? `Add sample` : `Update sample`}
                  </Typography>
                </Button>
                <IconButton
                  onClick={() =>
                    navigateToRoute('surveyDashboard', { params: { id } })
                  }
                >
                  <CloseIcon sx={{ fill: '#fff' }} />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Box sx={{ mx: 4, mb: 2 }}>
              <HazardsContext.Provider
                value={{
                  hazardType: instrumentType, // @TODO: Is this InstrumentType or HazardType?
                  useGetAllQuery: useGetAllHazardsQuery,
                }}
              >
                <form
                  onSubmit={(event) => {
                    onFormSubmit(event);
                    setOpen(true);
                  }}
                >
                  <DynamicAPIContext.Provider
                    value={{
                      useGetAllMediaQuery: useGetAllSampleMediaStaticQuery,
                      useGetAllInstrumentsQuery: useGetAllInstrumentsQuery,
                      useGetAllCalibrationInstrumentsQuery:
                        useGetAllCalibrationDevicesQuery,
                    }}
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
                      {!sampleId ? `Create new sample` : `Update sample`}
                    </Button>
                  </Box>
                </form>
              </HazardsContext.Provider>
            </Box>
            <Dialog
              open={openAlert}
              onClose={handleCloseAlert}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                id="alert-dialog-title"
                sx={{ color: colors.accent1['700'] }}
              >
                Are you sure you want to close this window?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  When closing this window, all data will be lost.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleCloseAlert(false)} autoFocus>
                  No, stay here
                </Button>
                <Button onClick={() => handleCloseAlert(true)}>
                  Yes, I'm sure
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Modal>
      )}
    </>
  );
}
