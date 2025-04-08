import { SampleDetail } from '../../ui';
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
  ISubmissionError,
  SUBMISSION_STATUS,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import {
  useGetChemicalResultByIdQuery,
  useGetNoiseResultByIdQuery,
  useGetSampleByIdQuery,
  useRegisterLastCheckSampleMutation,
} from '../../api';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import { useOutletContext, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { sampleActions, SampleState } from '../../sample.slice';
import { selectIsClient } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';

const casNumberCheck = (value: string) => {
  if (value === undefined || value === '0000-0000-0000' || value === '') {
    return '';
  }

  return `- # ${value}`;
};

export function SampleDetailPage() {
  const isClient = useSelector(selectIsClient);
  const { id = '', sampleId = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const { surveyMoment } = useOutletContext<{
    surveyMoment: { project: string; startDate: string };
  }>();
  const [open, setOpen] = useState<boolean>(true);
  const [hasError, setHasError] = useState<{
    hasError: boolean;
    errorMessage: null | ISubmissionError;
  }>({ hasError: false, errorMessage: null });
  const needsRefetch = useSelector(
    (state: { sample: SampleState }) => state.sample.needsRefetch,
  );
  const dispatch = useDispatch();
  const { updateNeedsRefetch } = sampleActions;

  const { record, recordId, refetch } = useRecord({
    givenId: sampleId,
    refetchOnMount: true,
    useRecordQuery: useGetSampleByIdQuery,
  });

  const sampleType = useMemo(
    () => record?.instrument.model.instrumentType,
    [record?.instrument.model.instrumentType],
  );

  const chemResponse = useGetChemicalResultByIdQuery(recordId || '', {
    skip: sampleType !== 'chemical',
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  const chemResultList = chemResponse.data;

  const noiseResponse = useGetNoiseResultByIdQuery(recordId || '', {
    skip: sampleType !== 'noise',
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  const noiseResultList = noiseResponse.data;

  const submitSuccessHandler = useCallback(() => {
    refetch();
  }, [refetch]);

  const { submissionStatus, submitHandler, submissionError } = useSubmitHandler(
    {
      isNewRecord: true,
      data: {
        sample: sampleId,
      },
      recordId: '',
      submitSuccessHandler,
      useCreateMutation: useRegisterLastCheckSampleMutation,
    },
  );

  useEffect(() => {
    if (!needsRefetch) {
      return;
    }
    refetch();
    chemResponse.refetch();
    noiseResponse.refetch();
    dispatch(updateNeedsRefetch({ needsRefetch: false }));
  }, [
    needsRefetch,
    refetch,
    updateNeedsRefetch,
    dispatch,
    chemResponse,
    noiseResponse,
  ]);

  const recordVolume = useMemo(
    () => record && record.durationInMinutes * record.averageFlowRate,
    [record],
  );

  const currentStatus = useMemo(() => {
    if (!record) {
      return 'No record found';
    }

    const hasStartTime = record.captureTimes?.find((time) => time.startTime);
    const hasEmptyEndTime = record.captureTimes?.find((time) => !time.endTime);

    if (record.finalFlowRate) {
      return 'Finished';
    }

    if (!hasStartTime) {
      return 'Not started';
    }

    if (hasEmptyEndTime) {
      return 'Running';
    }

    return 'Stopped';
  }, [record]);

  const lastCheck = useMemo(() => {
    if (!record) {
      return;
    }

    if (record.checkins.length === 0) {
      return;
    }

    return record.checkins[0];
  }, [record]);

  if (!record) {
    return <PageNotFound />;
  }

  return (
    <>
      {hasError.hasError && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          showButton
          errorList={hasError.errorMessage?.data as { [key: string]: [string] }}
          open={hasError.hasError}
          handleClose={() =>
            setHasError({ hasError: false, errorMessage: null })
          }
        />
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
            navigateToRoute('surveyDashboard', { params: { id: id } });
          }
        }}
        aria-labelledby="sample-detail-modal-title"
        aria-describedby="sample-detail-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '720px',
            height: 'calc(100% - 64px)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
          }}
        >
          <AppBar color="secondary" elevation={0}>
            <Toolbar
              sx={{
                px: '32px !important',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {!isClient ? (
                <Button
                  onClick={() =>
                    navigateToRoute('sampleUpdate', {
                      params: { id: id, sampleId: sampleId },
                    })
                  }
                  sx={{
                    fontSize: '1.25rem',
                    textTransform: 'None',
                  }}
                >
                  <Typography
                    variant="h6"
                    color="#fff"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    {`# ${record.sampleId}`}
                    <EditIcon sx={{ ml: 2 }} />
                  </Typography>
                </Button>
              ) : (
                <Typography
                  variant="h6"
                  color="#fff"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {`# ${record.sampleId}`}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  navigateToRoute('surveyDashboard', {
                    params: {
                      id: id,
                    },
                    query: { selectedDate: surveyMoment.startDate },
                  })
                }
              >
                <CloseIcon sx={{ color: '#fff' }} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box mb={6} />

          <SampleDetail
            isClient={isClient}
            title={`# ${record.sampleId}`}
            subtitle={record.sampler}
            instrument={record.instrument ? record.instrument.model.title : ''}
            instrumentSerial={record.instrument.serialNumber}
            sampleMedia={record.medium ? record.medium.title : '---'}
            sampleMediaSerial={record.mediumSerialNumber || '---'}
            calibrator={
              record.calibratedWith
                ? `${record.calibratedWith.model.title} ${record.calibratedWith.serialNumber}`
                : ''
            }
            hazards={record.hazards.map(
              (item) => `${item.title} ${casNumberCheck(item.casNumber)}`,
            )}
            status={currentStatus}
            captureTimes={record.captureTimes}
            sampleId={record.id}
            lastCheck={
              lastCheck
                ? `${dayjs(lastCheck.createdAt).format(
                    'D MMMM YYYY, hh:mm a',
                  )} (${dayjs(lastCheck.createdAt).fromNow()})`
                : 'Has not been checked'
            }
            initialFlowRate={record.initialFlowRate || ''}
            finalFlowRate={record.finalFlowRate ? record.finalFlowRate : '---'}
            averageFlowRate={
              record.averageFlowRate
                ? new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  }).format(record.averageFlowRate)
                : '---'
            }
            type={record.type}
            sampleVolume={recordVolume?.toFixed(3)}
            twa={record.twaCalculationMethod?.title || ''}
            onClickEdit={() =>
              navigateToRoute('sampleUpdate', {
                params: { id: id, sampleId: sampleId },
              })
            }
            onClickRegister={() => submitHandler()}
            onClickFinish={() =>
              navigateToRoute('sampleFinish', {
                params: { id: id, sampleId: sampleId },
              })
            }
            onClickMoveSample={() =>
              navigateToRoute('moveSample', {
                params: { id: id, sampleId: sampleId },
              })
            }
            chemResultList={chemResultList}
            noiseResult={noiseResultList}
            sampleType={sampleType}
            hazardsList={record.hazards}
          />
        </Box>
      </Modal>
    </>
  );
}
