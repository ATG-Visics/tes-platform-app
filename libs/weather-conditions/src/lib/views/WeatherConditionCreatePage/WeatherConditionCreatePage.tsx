import { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
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
import {
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import { TransitionsModal } from '@tes/ui/core';
import { FormTheme } from '@tes/ui/form';
import {
  IWeatherConditionPayload,
  useCreateWeatherConditionMutation,
  useDeleteWeatherConditionMutation,
  useGetWeatherConditionByIdQuery,
  useUpdateWeatherConditionMutation,
} from '../../api';
import { schema, uiSchema } from './schemas';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { DYNAMIC_FORM_STATUS, useSetApiDataInSchema } from '../../hooks';
import { useCustomNavigate } from '@tes/router';

export enum WEATHER_CREATE_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function WeatherConditionCreatePage() {
  const { id = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const { weatherId = '' } = useParams();
  const { surveyMoment } = useOutletContext<{
    surveyMoment: {
      project: string;
      startDate: string;
    };
  }>();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [weatherCreateStatus, setWeatherCreateStatus] =
    useState<WEATHER_CREATE_STATUS>(WEATHER_CREATE_STATUS.IDLE);
  const [data, setData] = useState<Partial<IWeatherConditionPayload>>({
    surveyMoment: surveyMoment,
    measuredAt: new Date().toISOString(),
  });

  const { record, recordStatus, recordId, isNewRecord } = useRecord({
    useRecordQuery: useGetWeatherConditionByIdQuery,
    givenId: weatherId,
  });

  const handleErrorClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { jsonformProps: baseJsonformProps } = useForm({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord,
    record,
    data,
    setData,
    extraRenderers,
  });

  const {
    jsonformProps,
    dynamicFormStatus,
    endOfDayPresent,
    startOfDayPresent,
  } = useSetApiDataInSchema({
    baseJsonformProps,
    surveyMoment,
  });

  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      startOfDayPresent: startOfDayPresent,
      endOfDayPresent: endOfDayPresent,
    }));
  }, [endOfDayPresent, startOfDayPresent]);

  const submitSuccessHandler = useCallback(
    (_) => {
      navigateToRoute(`surveyDashboard`, { params: { id } });
    },
    [id, navigateToRoute],
  );

  const [deleteItem] = useDeleteWeatherConditionMutation();

  const onDelete = useCallback(() => {
    if (!recordId) {
      return;
    }

    deleteItem(recordId)
      .unwrap()
      .then(
        (_) => {
          navigateToRoute(`surveyDashboard`, { params: { id } });
        },
        (_) => {
          setWeatherCreateStatus(WEATHER_CREATE_STATUS.FAILED);
        },
      );
  }, [deleteItem, id, navigateToRoute, recordId]);

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: !weatherId,
    data,
    recordId: weatherId,
    submitSuccessHandler,
    useCreateMutation: useCreateWeatherConditionMutation,
    useUpdateMutation: useUpdateWeatherConditionMutation,
  });

  return (
    <>
      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          errorList={submissionError?.data as { [key: string]: [string] }}
          showButton
          open={isOpen}
          handleClose={handleErrorClose}
        />
      )}

      {weatherCreateStatus === WEATHER_CREATE_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          errorList={submissionError?.data as { [key: string]: [string] }}
          showButton
          open={isOpen}
          handleClose={handleErrorClose}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={isOpen}
          handleClose={handleErrorClose}
        />
      )}

      {jsonformProps && dynamicFormStatus === DYNAMIC_FORM_STATUS.SUCCEEDED && (
        <Modal
          open={true}
          onClose={(_event, reason) => {
            if (reason === 'escapeKeyDown') {
              navigateToRoute(`surveyDashboard`, { params: { id } });
            }
          }}
          aria-labelledby="weather-condition-modal-title"
          aria-describedby="weather-condition-modal-description"
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
            <AppBar color="secondary">
              <Toolbar
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography variant="h5" color="#fff">
                  Add Weather condition
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
            <Box mb={6} />
            <form onSubmit={onFormSubmit}>
              <FormTheme>
                <JsonForms {...baseJsonformProps} />
              </FormTheme>
              {weatherId ? (
                <Box
                  mt={3}
                  sx={{ display: 'flex', justifyContent: `space-between` }}
                >
                  <Button onClick={onDelete} variant="contained" color="error">
                    Delete weather condition
                  </Button>
                  <Button type="submit" variant="contained">
                    Update weather condition
                  </Button>
                </Box>
              ) : (
                <Box
                  mt={3}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button type="submit" variant="contained">
                    Add new weather condition
                  </Button>
                </Box>
              )}
            </form>
          </Box>
        </Modal>
      )}
    </>
  );
}
