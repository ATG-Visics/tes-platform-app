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
  WeldingContext,
} from '@tes/utils-hooks';
import {
  IAreaSampleSubjectPayload,
  useGetAreaSubjectByIdQuery,
  useUpdateAreaSampleSubjectMutation,
} from '@tes/area-subject-api';
import { useGetAllMetalQuery } from '@tes/static-dropdown-data';

import { useCallback, useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { TransitionsModal } from '@tes/ui/core';
import { FormTheme } from '@tes/ui/form';
import { DYNAMIC_FORM_STATUS } from '../../hooks';
import { Close as CloseIcon } from '@mui/icons-material';
import { useOutletContext, useParams } from 'react-router-dom';
import { schema, uiSchema } from './Schemas';
import { useSetApiDataInUpdateSchema } from '../../hooks/useSetApiDataInUpdateSchema.hooks';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useCustomNavigate } from '@tes/router';
import { samplingPlanRenderers } from '@tes/sampling-plan';
import { produce } from 'immer';

export function AreaSampleSubjectUpdatePage() {
  const { id = '', subjectId = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const { surveyMoment } = useOutletContext<{
    surveyMoment: {
      project: string;
      startDate: string;
    };
  }>();

  const [open, setOpen] = useState<boolean>(true);
  const [data, setData] = useState<Partial<IAreaSampleSubjectPayload>>({});

  const { record, recordStatus, isNewRecord, refetch } = useRecord({
    givenId: subjectId,
    useRecordQuery: useGetAreaSubjectByIdQuery,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { jsonformProps: baseJsonformProps, formStatus } = useForm({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord,
    record,
    data,
    setData,
    extraRenderers: [...extraRenderers, ...samplingPlanRenderers],
  });

  const { jsonformProps, dynamicFormStatus } = useSetApiDataInUpdateSchema({
    baseJsonformProps,
    schema,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      setData({});
      navigateToRoute('surveyDashboard');
    },
    [navigateToRoute],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: false,
    data: {
      ...data,
      surveyMoment: surveyMoment,
    },
    recordId: subjectId,
    submitSuccessHandler,
    useUpdateMutation: useUpdateAreaSampleSubjectMutation,
  });

  useEffect(() => {
    if (!record) {
      return;
    }

    if (recordStatus !== RECORD_STATUS.SUCCEEDED) {
      return;
    }

    const formattedRecord = Object.entries(record).reduce(
      (acc, [key, value]) => {
        if (value === null) {
          acc[key] = '';
          return acc;
        }

        if (typeof value === 'object') {
          acc[key] = value['id'] !== null ? value['id'] : '';
        } else {
          acc[key] = value;
        }

        return acc;
      },
      {} as Record<string, string>,
    );
    setData({
      ...formattedRecord,
      whichSubject: 'area',
      useSamplingPlan: record?.samplingPlan ? 'samplingPlan' : 'noSamplingPlan',
    });
  }, [record, recordStatus]);

  useEffect(() => {
    if (data.useSamplingPlan === 'noSamplingPlan') {
      setData(
        produce((draft) => {
          draft.samplingPlan = null;
        }),
      );
    }
  }, [data.useSamplingPlan]);

  return (
    <>
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
                  <form onSubmit={onFormSubmit}>
                    <FormTheme>
                      <JsonForms {...jsonformProps} />
                    </FormTheme>
                    <Box
                      mt={3}
                      sx={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button type="submit" variant="contained">
                        Update area subject
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
