import {
  AppBar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  DOWNLOAD_STATUS,
  ISubmissionError,
  RECORD_STATUS,
  useDownloadHooks,
  useRecord,
} from '@tes/utils-hooks';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useOutletContext, useParams } from 'react-router-dom';
import {
  IAreaSampleSubject,
  useDownloadAreaSubjectPDFStarterMutation,
  useDownloadAreaSubjectPDFStatusQuery,
  useGetAreaSubjectByIdQuery,
} from '@tes/area-subject-api';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useCustomNavigate } from '@tes/router';
import { LoadingButton } from '@mui/lab';

const softRequiredFields: (keyof IAreaSampleSubject)[] = [
  'ventilation',
  'workEnvironment',
  'weldingProcess',
  'samplingConditions',
  'unusualConditions',
];

export function AreaSampleSubjectDetailPage() {
  const { id = '', subjectId = '' } = useParams();
  const { surveyMoment } = useOutletContext<{
    surveyMoment: { project: string; startDate: string };
  }>();
  const { navigateToRoute } = useCustomNavigate();
  const [hasError, setHasError] = useState<{
    hasError: boolean;
    errorMessage: null | ISubmissionError;
  }>({ hasError: false, errorMessage: null });
  const [open, setOpen] = useState(true);

  const { record, recordStatus } = useRecord({
    givenId: subjectId,
    useRecordQuery: useGetAreaSubjectByIdQuery,
  });

  const formattedDate = useMemo(
    () => dayjs(surveyMoment.startDate).format('MMM DD YYYY, hh-mm a'),
    [surveyMoment],
  );

  const hasMissingSoftRequiredFields = useMemo(
    () => softRequiredFields.some((field) => !record?.[field]),
    [record],
  );

  const { onClickDownload, downloadStatus, downloadError } = useDownloadHooks({
    useStartMutation: useDownloadAreaSubjectPDFStarterMutation,
    useStatusQuery: useDownloadAreaSubjectPDFStatusQuery,
  });

  if (!record) {
    return <PageNotFound />;
  }

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}

      {downloadStatus === DOWNLOAD_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred when downloading the PDF form the server"
          description={downloadError}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

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

      <Modal
        open={true}
        onClose={(_event, reason) => {
          if (reason === 'escapeKeyDown') {
            navigateToRoute(`surveyDashboard`, { params: { id } });
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
            maxWidth: '720px',
            height: 'fit-content',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
          }}
        >
          <AppBar color="secondary" elevation={0}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" color="#fff">
                {record.title}
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

          <List>
            <ListItem
              sx={{
                p: 0,
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Box sx={{ maxWidth: '500px' }}>
                  <ListItemText sx={{ mb: 0 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Description
                    </Typography>
                  </ListItemText>
                  <ListItemText sx={{ mt: 0 }}>
                    {record.taskDescription}
                  </ListItemText>
                </Box>
                <LoadingButton
                  sx={{ height: 'fit-content' }}
                  onClick={() =>
                    onClickDownload(
                      subjectId,
                      `${formattedDate} -- ${record?.title}`,
                      true,
                    )
                  }
                  startIcon={<DownloadIcon />}
                  loading={downloadStatus === DOWNLOAD_STATUS.LOADING}
                  loadingPosition="start"
                  variant="contained"
                >
                  Download PDF
                </LoadingButton>
              </Box>
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />
          {hasMissingSoftRequiredFields ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <WarningIcon sx={{ mr: 2 }} />
              <Typography fontWeight="bold">
                Not all data is filled in.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant={'h5'}>Environment info</Typography>
              <List>
                <ListItem
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText sx={{ mb: 0 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Sampling conditions (based on the sample personnel’s
                      option)
                    </Typography>
                  </ListItemText>
                  <ListItemText sx={{ mt: 0 }}>
                    {record.samplingConditions.title}
                  </ListItemText>
                </ListItem>
                <ListItem
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText sx={{ mb: 0 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Work environment
                    </Typography>
                  </ListItemText>
                  <ListItemText sx={{ mt: 0 }}>
                    {record.workEnvironment.title}
                  </ListItemText>
                </ListItem>
                <ListItem
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText sx={{ mb: 0 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Ventilation
                    </Typography>
                  </ListItemText>
                  <ListItemText sx={{ mt: 0 }}>
                    {record.ventilation.title}
                  </ListItemText>
                </ListItem>
                <ListItem
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText sx={{ mb: 0 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Welding process
                    </Typography>
                  </ListItemText>
                  <ListItemText sx={{ mt: 0 }}>
                    {record.weldingProcess.title}
                  </ListItemText>
                </ListItem>
                <ListItem
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText sx={{ mb: 0 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Metal welded
                    </Typography>
                  </ListItemText>
                  <ListItemText sx={{ mt: 0 }}>
                    {record.metal ? record.metal.title : ''}
                  </ListItemText>
                </ListItem>
                <ListItem
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText sx={{ mb: 0 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Electrode
                    </Typography>
                  </ListItemText>
                  <ListItemText sx={{ mt: 0 }}>{record.electrode}</ListItemText>
                </ListItem>
              </List>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
