import { Box, Button, CircularProgress } from '@mui/material';
import { JsonForms } from '@jsonforms/react';
import { schema, uiSchema } from './Schemas';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useCallback, useEffect, useState } from 'react';
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
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import {
  ISamplingPlanPayload,
  useCreateSamplingPlanMutation,
  useGetAllHazardsQuery,
  useGetAllSampleMediaStaticQuery,
  useGetAllSegQuery,
  useGetSamplingPlanByIdQuery,
  useUpdateSamplingPlanMutation,
} from '../../api';
import { useParams } from 'react-router-dom';
import { FormTheme } from '@tes/ui/form';
import { useDispatch } from 'react-redux';
import { samplingPlanActions } from '../../sampling-plan.slice';
import { useGetAllInstrumentsQuery } from '@tes/instruments';
import { useGetAllCalibrationDevicesQuery } from '@tes/calibration';
import { SamplingPlanDeletePage } from '../../views';
import { useCustomNavigate } from '@tes/router';
import { useFeedback } from '@tes/feedback';
import { useDynamicFormElements } from '../../hooks/useDynamicFormElements.hooks';

export function SamplingPlanCreateForm() {
  const dispatch = useDispatch();
  const { updateNeedsRefetch } = samplingPlanActions;

  const { id = '', samplingPlanId = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const { showFeedback } = useFeedback();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const [data, setData] = useState<
    Partial<ISamplingPlanPayload & { subjectType: string }>
  >({
    project: { id: id, title: '' },
  });

  const { recordId, record, recordStatus } = useRecord({
    givenId: samplingPlanId,
    useRecordQuery: useGetSamplingPlanByIdQuery,
  });

  const {
    jsonformProps: baseJsonformProps,
    formStatus,
    hasFormErrors,
  } = useForm({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord: !samplingPlanId,
    record,
    data,
    setData,
    extraRenderers,
  });

  const { jsonformProps } = useDynamicFormElements({ baseJsonformProps });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      setData({});
      navigateToRoute('samplingPlanList');
      dispatch(updateNeedsRefetch({ needsRefetch: true }));
    },
    [dispatch, navigateToRoute, updateNeedsRefetch],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: !samplingPlanId,
    data,
    recordId: samplingPlanId,
    submitSuccessHandler,
    useCreateMutation: useCreateSamplingPlanMutation,
    useUpdateMutation: useUpdateSamplingPlanMutation,
  });

  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(true);

  const handleCloseErrorModal = useCallback(() => {
    setIsErrorModalOpen(false);
  }, []);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const buttonsBoxClass = {
    mt: 4,
    display: 'flex',
    justifyContent: data.id ? 'space-between' : 'end',
  };

  useEffect(() => {
    if (
      submissionStatus === SUBMISSION_STATUS.FAILED &&
      submissionError &&
      isErrorModalOpen
    ) {
      showFeedback({
        type: 'error',
        message: 'Please try submitting the form again',
        submissionError: submissionError,
        visualizationType: 'modal',
        onClose: handleCloseErrorModal,
      });
    }
  }, [
    handleCloseErrorModal,
    isErrorModalOpen,
    showFeedback,
    submissionError,
    submissionStatus,
  ]);

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={isOpen}
          handleClose={handleClose}
        />
      )}

      {formStatus === FORM_STATUS.SUCCEEDED && jsonformProps && (
        <Box sx={{ rowGap: 4 }}>
          <HazardsContext.Provider
            value={{
              useGetAllQuery: useGetAllHazardsQuery,
            }}
          >
            <form
              onSubmit={(event) => {
                onFormSubmit(event);
              }}
            >
              <DynamicAPIContext.Provider
                value={{
                  useGetAllMediaQuery: useGetAllSampleMediaStaticQuery,
                  useGetAllInstrumentsQuery: useGetAllInstrumentsQuery,
                  useGetAllCalibrationInstrumentsQuery:
                    useGetAllCalibrationDevicesQuery,
                  useGetAllQuery: useGetAllSegQuery,
                }}
              >
                <FormTheme>
                  <JsonForms {...jsonformProps} />
                  <Box sx={buttonsBoxClass}>
                    {data.id && (
                      <Button
                        onClick={handleOpenDeleteModal}
                        variant="outlined"
                        sx={{
                          mr: 2,
                          color: '#e53935',
                          borderColor: '#e53935',
                          '&:hover, &:focus': {
                            color: '#b71c1c',
                            borderColor: '#b71c1c',
                          },
                        }}
                      >
                        Delete Scenario
                      </Button>
                    )}
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      disabled={hasFormErrors}
                    >
                      {!samplingPlanId
                        ? `Create new scenario`
                        : `Update scenario`}
                    </Button>
                  </Box>
                </FormTheme>
              </DynamicAPIContext.Provider>
            </form>
          </HazardsContext.Provider>
          <SamplingPlanDeletePage
            onCancel={handleCloseDeleteModal}
            open={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            modalName={'Sampling Plan Scenario'}
            recordId={recordId}
          />
        </Box>
      )}
    </>
  );
}
