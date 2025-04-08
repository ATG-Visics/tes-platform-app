import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { AlertTitle } from '@mui/lab';
import { useOutletContext, useParams } from 'react-router-dom';

import {
  DOWNLOAD_STATUS,
  ISubmissionError,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useDownloadHooks,
  useRecord,
} from '@tes/utils-hooks';
import { useCallback, useMemo, useState } from 'react';
import { TransitionsModal } from '@tes/ui/core';
import {
  QUESTION_STATUS,
  useCreateQuestionFormHook,
  useDynamicAnswersHooks,
  useStaticAnswersHooks,
} from '../../hooks';
import { materialRenderers } from '@jsonforms/material-renderers';
import { extraRenderers } from '@tes/jsonforms-extensions';
import dayjs, { Dayjs } from 'dayjs';
import { SurveyDashboardCalendar } from '@tes/platform';
import { GroupAccordion } from '../../ui/GroupAccordion';
import {
  useDownloadAllAnswersStarterMutation,
  useDownloadAllAnswersStatusQuery,
  useGetProjectByIdAnswersQuery,
} from '../../api';
import { questionExtraRenderers } from '../../control';

interface ContextType {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
}

export function AnswerCreatePage() {
  const { selectedDate, setSelectedDate } = useOutletContext<ContextType>();
  const { id: projectId = '' } = useParams();

  const renderers = useMemo(() => {
    return [...materialRenderers, ...extraRenderers, ...questionExtraRenderers];
  }, []);

  const [hasError, setHasError] = useState<{
    hasError: boolean;
    errorMessage: null | ISubmissionError;
  }>({ hasError: false, errorMessage: null });

  const [open, setOpen] = useState<boolean>(true);
  const handleClose = useCallback(() => setOpen(false), []);

  const [openAlert, setOpenAlert] = useState<boolean>(true);
  const handleCloseAlert = useCallback(() => setOpenAlert(false), []);

  const { record, recordId } = useRecord({
    useRecordQuery: useGetProjectByIdAnswersQuery,
  });

  const submitSuccessHandler = useCallback(() => {
    setOpenAlert(true);
  }, []);

  const { status, staticGroupList, dynamicGroupList } =
    useCreateQuestionFormHook({ projectId });

  const formattedSelectedDate = dayjs(selectedDate).format('YYYY-MM-DD');

  const {
    dynamicData,
    setDynamicData,
    dynamicSubmissionStatus,
    onDynamicFormSubmit,
    recordStatus: dynamicRecordStatus,
  } = useDynamicAnswersHooks({
    projectId,
    submitSuccessHandler,
    selectedDate: formattedSelectedDate,
  });

  const {
    data,
    setData,
    recordStatus,
    submissionStatus,
    onFormSubmit,
    submissionError,
  } = useStaticAnswersHooks({ projectId, submitSuccessHandler });

  const { onClickDownload, downloadStatus, downloadError } = useDownloadHooks({
    useStartMutation: useDownloadAllAnswersStarterMutation,
    useStatusQuery: useDownloadAllAnswersStatusQuery,
  });

  return (
    <>
      {hasError.hasError && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to download the PDF again."
          showButton
          errorList={hasError.errorMessage?.data as { [key: string]: [string] }}
          open={hasError.hasError}
          handleClose={() =>
            setHasError({ hasError: false, errorMessage: null })
          }
        />
      )}

      {downloadStatus === DOWNLOAD_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred when downloading the PDF form the server"
          description={downloadError}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {(submissionStatus === SUBMISSION_STATUS.FAILED ||
        dynamicSubmissionStatus === SUBMISSION_STATUS.FAILED) && (
        <TransitionsModal
          title="There is an error with the server"
          description="Try again to submit the form"
          showButton
          errorList={submissionError?.data as { [key: string]: [string] }}
          open={open}
          handleClose={handleClose}
        />
      )}

      {(submissionStatus === SUBMISSION_STATUS.SUCCEEDED ||
        dynamicSubmissionStatus === SUBMISSION_STATUS.SUCCEEDED) && (
        <Collapse in={openAlert}>
          <Snackbar
            open={openAlert}
            autoHideDuration={4000}
            onClose={handleCloseAlert}
          >
            <Alert
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handleCloseAlert}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>Success</AlertTitle>
              The answers are saved successfully.
            </Alert>
          </Snackbar>
        </Collapse>
      )}

      {status === QUESTION_STATUS.SUCCEEDED &&
        (recordStatus === RECORD_STATUS.SUCCEEDED ||
          dynamicRecordStatus === RECORD_STATUS.SUCCEEDED) && (
          <Container sx={{ mt: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h4" mb={2}>
                Prompted Questions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() =>
                    onClickDownload(
                      {
                        project: `${recordId}`,
                        startDate: formattedSelectedDate,
                      },
                      `${record?.title} - answers`,
                      false,
                    )
                  }
                >
                  Download selected daily questions
                </Button>
                <Button
                  variant="contained"
                  onClick={() =>
                    onClickDownload(
                      {
                        project: `${recordId}`,
                      },
                      `${record?.title} - answers`,
                      false,
                    )
                  }
                >
                  Download all questions
                </Button>
              </Box>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" mb={2} sx={{ fontWeight: 500 }}>
                  {`Survey Dashboard, ${
                    selectedDate
                      ? dayjs(selectedDate).format('ddd DD MMM YYYY')
                      : dayjs().format('ddd DD MMM YYYY')
                  }`}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: 'inline-flex', justifyContent: 'flex-end' }}
              >
                <SurveyDashboardCalendar
                  startDate={new Date('2023-01-01')}
                  value={selectedDate}
                  setValue={setSelectedDate}
                />
              </Grid>
            </Grid>
            <Typography variant="h5" fontWeight="bold">
              Daily Questions
            </Typography>
            {dynamicGroupList.map((item) => (
              <GroupAccordion
                key={item.title}
                item={item}
                onFormSubmit={onDynamicFormSubmit}
                renderers={renderers}
                data={dynamicData}
                setData={setDynamicData}
              />
            ))}

            <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
              One time Questions
            </Typography>

            {staticGroupList.map((item) => (
              <GroupAccordion
                key={item.title}
                item={item}
                onFormSubmit={onFormSubmit}
                renderers={renderers}
                data={data}
                setData={setData}
              />
            ))}
          </Container>
        )}
    </>
  );
}
