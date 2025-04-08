import { useOutletContext, useParams } from 'react-router-dom';
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
  Close as CloseIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  DOWNLOAD_STATUS,
  ISubmissionError,
  RECORD_STATUS,
  useDownloadHooks,
  useRecord,
} from '@tes/utils-hooks';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import {
  IPersonSampleSubject,
  useDownloadPersonSubjectPDFStarterMutation,
  useDownloadPersonSubjectPDFStatusQuery,
  useGetPersonSubjectByIdQuery,
} from '@tes/person-subject-api';
import { useCustomNavigate } from '@tes/router';
import { useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import { PPEInfoChips } from '../../ui';
import { EnvironmentInfoItem } from '../../ui';

const softRequiredFields: (keyof IPersonSampleSubject)[] = [
  'workEnvironment',
  'ventilation',
  'weldingProcess',
  'samplingConditions',
  'unusualConditions',
  // Person specific
  'exposureControls',
  // Person PPE
  'clothing',
  'respirator',
  'gloves',
  'boots',
  'eyeWear',
  'hearingProtection',
  'headProtection',
];

export function PersonSubjectDetailPage() {
  const { id = '', subjectId = '' } = useParams();
  const { navigateToRoute } = useCustomNavigate();
  const { surveyMoment } = useOutletContext<{
    surveyMoment: { project: string; startDate: string };
  }>();

  const { record, recordStatus } = useRecord({
    givenId: subjectId,
    useRecordQuery: useGetPersonSubjectByIdQuery,
  });

  const [open, setOpen] = useState(true);
  const [hasError, setHasError] = useState<{
    hasError: boolean;
    errorMessage: null | ISubmissionError;
  }>({ hasError: false, errorMessage: null });

  const { onClickDownload, downloadStatus, downloadError } = useDownloadHooks({
    useStartMutation: useDownloadPersonSubjectPDFStarterMutation,
    useStatusQuery: useDownloadPersonSubjectPDFStatusQuery,
  });

  const formattedDate = useMemo(
    () => dayjs(surveyMoment.startDate).format('MMM DD YYYY, hh-mm a'),
    [surveyMoment],
  );

  const hasMissingSoftRequiredFields = useMemo(
    () =>
      softRequiredFields.some((field) => {
        const value = record?.[field];
        return !value || (Array.isArray(value) && value.length === 0);
      }),
    [record],
  );

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
            height: 'calc(100% - 32px)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
          }}
        >
          <AppBar color="secondary" elevation={0}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" color="#fff">
                Sample subject
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
          <Box>
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
                  <Box>
                    <ListItemText sx={{ mb: 0 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        Employee name
                      </Typography>
                    </ListItemText>
                    <ListItemText sx={{ mt: 0 }}>{record.title}</ListItemText>
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
                    Employee ID
                  </Typography>
                </ListItemText>
                <ListItemText sx={{ mt: 0 }}>
                  {record.employeeNumber}
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
                  <Typography sx={{ fontWeight: 'bold' }}>Job title</Typography>
                </ListItemText>
                <ListItemText sx={{ mt: 0 }}>{record.jobTitle}</ListItemText>
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
                    Shift length
                  </Typography>
                </ListItemText>
                <ListItemText sx={{ mt: 0 }}>
                  {record.shiftLength} hours
                </ListItemText>
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            {hasMissingSoftRequiredFields && (
              <Box display="flex" justifyContent="center" alignItems="center">
                <WarningIcon sx={{ mr: 2 }} />
                <Typography fontWeight="bold">
                  Not all data is filled in.
                </Typography>
              </Box>
            )}
            <Box>
              <Typography variant={'h5'}>Environment info</Typography>
              <List>
                <EnvironmentInfoItem
                  title="Work environment"
                  item={record.workEnvironment}
                />
                <EnvironmentInfoItem
                  title="Ventilation"
                  item={record.ventilation}
                />
                <EnvironmentInfoItem
                  title="Welding process"
                  item={record.weldingProcess}
                />

                {record.weldingProcess &&
                  record.weldingProcess.title !== 'N/A' &&
                  record.weldingProcess.title !== '' && (
                    <>
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
                          {record.metal ? record.metal.title : ' - '}
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
                        <ListItemText sx={{ mt: 0 }}>
                          {record.electrode ? record.electrode : ' - '}
                        </ListItemText>
                      </ListItem>
                    </>
                  )}
                <EnvironmentInfoItem
                  title="Sampling conditions (based on the subjects opinion)"
                  item={record.samplingConditions}
                />
                <EnvironmentInfoItem
                  title="Unusual condition"
                  item={record.unusualConditions}
                />
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
                      Exposure Control
                    </Typography>
                  </ListItemText>
                  <ListItemText sx={{ mt: 0 }}>
                    {record.exposureControls
                      ? record.exposureControlsOther
                        ? record.exposureControlsOther
                        : record.exposureControls.title
                      : ' - '}
                  </ListItemText>
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant={'h5'}>PPE info</Typography>
              <List>
                <PPEInfoChips items={record.clothing} title="Clothing" />
                <PPEInfoChips items={record.respirator} title="Respirator" />
                {record.respiratorFilters && (
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
                        Respirator Filters
                      </Typography>
                    </ListItemText>
                    <ListItemText sx={{ mt: 0 }}>
                      {record.respiratorFilters || ' - '}
                    </ListItemText>
                  </ListItem>
                )}
                <PPEInfoChips items={record.gloves} title="Gloves" />
                <PPEInfoChips items={record.boots} title="Boots" />
                <PPEInfoChips items={record.eyeWear} title="Eye wear" />
                <PPEInfoChips
                  items={record.hearingProtection}
                  title="Hearing Protection Category"
                />
                {record.noiseReductionRating && (
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
                        Noise reduction rating (dB)
                      </Typography>
                    </ListItemText>
                    <ListItemText sx={{ mt: 0 }}>
                      {record.noiseReductionRating || ' - '}
                    </ListItemText>
                  </ListItem>
                )}

                <PPEInfoChips
                  items={record.headProtection}
                  title="Head Protection"
                />
              </List>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
