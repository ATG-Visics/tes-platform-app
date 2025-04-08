import { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
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
import { JsonForms } from '@jsonforms/react';

import {
  DynamicAPIContext,
  FORM_STATUS,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
  WeldingContext,
} from '@tes/utils-hooks';
import {
  IPersonSampleSubjectPayload,
  useGetPersonSubjectByIdQuery,
  useUpdatePersonSampleSubjectMutation,
} from '@tes/person-subject-api';
import {
  useGetAllMetalQuery,
  useGetAllSegQuery,
} from '@tes/static-dropdown-data';
import { TransitionsModal } from '@tes/ui/core';
import { FormTheme } from '@tes/ui/form';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useCustomNavigate } from '@tes/router';
import { samplingPlanRenderers } from '@tes/sampling-plan';

import { DYNAMIC_FORM_STATUS, useSetApiDataInUpdateSchema } from '../../hooks';
import { schema, uiSchema } from './Schemas';
import { produce } from 'immer';

export function PersonSubjectUpdatePage() {
  const { id = '', subjectId = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const { surveyMoment } = useOutletContext<{
    surveyMoment: {
      project: string;
      startDate: string;
    };
  }>();

  const [open, setOpen] = useState<boolean>(true);
  const [data, setData] = useState<Partial<IPersonSampleSubjectPayload>>({});

  const { record, recordStatus, isNewRecord, refetch } = useRecord({
    givenId: subjectId,
    useRecordQuery: useGetPersonSubjectByIdQuery,
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
    data: { ...data, surveyMoment: surveyMoment },
    recordId: subjectId,
    submitSuccessHandler,
    useUpdateMutation: useUpdatePersonSampleSubjectMutation,
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
      whichSubject: 'person',
      clothing: record.clothing.map((item) => item.id),
      respirator: record.respirator.map((item) => item.id),
      gloves: record.gloves.map((item) => item.id),
      boots: record.boots.map((item) => item.id),
      eyeWear: record.eyeWear.map((item) => item.id),
      hearingProtection: record.hearingProtection.map((item) => item.id),
      headProtection: record.headProtection.map((item) => item.id),
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
          showButton
          errorList={submissionError?.data as { [key: string]: [string] }}
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
                navigateToRoute('surveyDashboard', { params: { id } });
              }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
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
                      navigateToRoute('surveyDashboard', { params: { id } })
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
                      onFormSubmit(event);
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
                      <Button type="submit" variant="contained">
                        Update person subject
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
