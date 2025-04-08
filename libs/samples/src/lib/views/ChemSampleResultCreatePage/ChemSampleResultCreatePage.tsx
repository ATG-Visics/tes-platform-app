import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { JsonForms } from '@jsonforms/react';
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

import { extraRenderers } from '@tes/jsonforms-extensions';
import {
  FORM_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import { useGetSamplingPlanByIdQuery } from '@tes/sampling-plan';
import { FormTheme } from '@tes/ui/form';

import { schema, uiSchema } from './schemas';
import {
  IChemicalResult,
  useCreateChemicalResultMutation,
  useGetChemicalResultByIdQuery,
  useGetSampleByIdQuery,
  useUpdateChemicalResultMutation,
} from '../../api';
import { useDynamicResultFormHooks } from '../../hooks';
import { TransitionsModal } from '@tes/ui/core';
import { useDispatch } from 'react-redux';
import { sampleActions } from '../../sample.slice';
import { produce } from 'immer';
import { useCustomNavigate } from '@tes/router';
import { uiSchemaHeader } from './schemas/uiSchema';

export function ChemSampleResultCreatePage() {
  const { navigateToRoute } = useCustomNavigate();
  const dispatch = useDispatch();
  const { sampleId = '', hazardId = '' } = useParams();
  const { updateNeedsRefetch } = sampleActions;

  const [data, setData] = useState<Partial<IChemicalResult>>({});
  const [open, setOpen] = useState<boolean>(true);

  const { record, recordId, recordStatus } = useRecord({
    givenId: sampleId,
    useRecordQuery: useGetSampleByIdQuery,
  });

  const { data: samplePlanRecord } = useGetSamplingPlanByIdQuery(
    record?.samplingPlan || '',
    { skip: !record?.samplingPlan },
  );

  const { record: hazardRecordList } = useRecord({
    givenId: sampleId,
    refetchOnMount: true,
    useRecordQuery: useGetChemicalResultByIdQuery,
  });

  const hazardInfo = useMemo(
    () =>
      samplePlanRecord &&
      samplePlanRecord.hazardScenarios?.find(
        (item) => (item.hazard as unknown as string) === hazardId,
      ),
    [hazardId, samplePlanRecord],
  );

  const currentUpdatedHazard = useMemo(() => {
    if (!hazardRecordList) {
      return;
    }
    if (!hazardId) {
      return;
    }

    return hazardRecordList?.find(
      (hazardItem) => hazardItem.hazard === hazardId,
    );
  }, [hazardId, hazardRecordList]);

  const currentHazard = record?.hazards.find(
    (hazardItem) => hazardItem.id === hazardId,
  );

  const recordVolume = useMemo(
    () => record && record.durationInMinutes * record.averageFlowRate,
    [record],
  );

  useEffect(() => {
    if (!currentUpdatedHazard) {
      setData((prevState) => ({
        ...prevState,
        hazard: hazardId,
        sample: recordId,
        volume: `${recordVolume?.toFixed(3)}`,
        total: `${record?.durationInMinutes}`,
        twaCalculationMethod: record?.twaCalculationMethod.title.toLowerCase(),
      }));
      return;
    }

    setData((prevState) => ({
      ...currentUpdatedHazard,
      ...prevState,
    }));
  }, [
    hazardId,
    recordId,
    recordVolume,
    record?.durationInMinutes,
    record?.twaCalculationMethod.title,
    currentUpdatedHazard,
  ]);

  useEffect(() => {
    if (!hazardInfo) {
      return;
    }

    if (!samplePlanRecord) {
      return;
    }

    setData(
      produce((draft) => {
        draft.oel = hazardInfo.oel;
        draft.al = hazardInfo.actionLevel;
        draft.method = hazardInfo.analyticalMethod;
        draft.unit = hazardInfo.unit as unknown as string;
      }),
    );
  }, [hazardInfo, samplePlanRecord]);

  const {
    jsonformProps: baseJsonformProps,
    formStatus,
    formErrors,
  } = useForm({
    schema: schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord: true,
    data,
    setData,
    extraRenderers,
  });

  const { jsonformProps } = useDynamicResultFormHooks({
    schema: schema,
    setData,
    baseJsonformProps,
    formStatus,
  });

  const submitSuccessHandler = useCallback(
    (_) => {
      dispatch(updateNeedsRefetch({ needsRefetch: true }));
      navigateToRoute('sampleDetail');
    },
    [dispatch, navigateToRoute, updateNeedsRefetch],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: !currentUpdatedHazard,
    data: {
      ...data,
    },
    recordId: currentUpdatedHazard?.id ? currentUpdatedHazard.id : '',
    submitSuccessHandler,
    useCreateMutation: useCreateChemicalResultMutation,
    useUpdateMutation: useUpdateChemicalResultMutation,
  });

  const errorLabelList = {
    al: 'Action level',
    oel: 'Occupational Exposure Limits',
    totalMass: 'Total mass',
    twaResult: 'TWA result',
    sampleResult: 'Sample result',
    volume: 'Volume (liters)',
    total: 'Total time (minutes)',
  };

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
          errorListExtra={errorLabelList as { [key: string]: string }}
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
                <IconButton onClick={() => navigateToRoute('sampleDetail')}>
                  <CloseIcon sx={{ fill: '#fff' }} />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Box mb={6} />
            <form
              onSubmit={(e) => {
                onFormSubmit(e);
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
                  {currentHazard?.title}
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
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!!formErrors?.length}
                    >
                      Add result
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
