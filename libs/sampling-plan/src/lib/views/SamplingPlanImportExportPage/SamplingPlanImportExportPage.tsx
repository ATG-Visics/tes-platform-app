import {
  Alert,
  Box,
  Button,
  Grid,
  Modal,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModalTitleBar } from '@tes/ui/core';
import { useCustomNavigate } from '@tes/router';
import Dropzone from 'react-dropzone';
import { UploadFile } from '@mui/icons-material';
import {
  useCreateSamplingPlanUploadMutation,
  useDownloadSamplingPlanMutation,
} from '../../api';
import { useRecord } from '@tes/utils-hooks';
import { useGetProjectByIdQuery } from '@tes/project';

export enum DOWNLOAD_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

const headcells = [
  'Scenario title',
  'Job title',
  'Shift length',
  'Subject type',
  'Task description',
  'Media',
  'Sample type',
  'Hazard CAS-number',
  'Hazard',
  'Unit',
  'Target amount',
  'Analytical method (not required)',
  'OEL (Occupational Exposure Limits)',
  'OEL Source',
  'Action level (not required)',
  'Action level source (not required)',
];

export function SamplingPlanImportExportModal() {
  const [open] = useState<boolean>(true);
  const { navigateToRoute } = useCustomNavigate();
  const [apiStatus, setApiStatus] = useState<DOWNLOAD_STATUS>(
    DOWNLOAD_STATUS.IDLE,
  );
  const [uploadStatus, setUploadStatus] = useState<DOWNLOAD_STATUS>(
    DOWNLOAD_STATUS.IDLE,
  );
  const [errorMessage, setErrorMessage] = useState('');

  const { id = '' } = useParams();

  const onClose = () => {
    navigateToRoute('projectOverview', { params: { id } });
  };

  const { record } = useRecord({
    useRecordQuery: useGetProjectByIdQuery,
  });

  const [download] = useDownloadSamplingPlanMutation();
  const [upload] = useCreateSamplingPlanUploadMutation();

  const downloadSamplingPlan = useCallback(() => {
    download({
      projectID: id,
      downloadTitle: `Sample plan of project: ${record?.title}`,
    })
      .unwrap()
      .then(
        (_successData) => {
          setApiStatus(DOWNLOAD_STATUS.SUCCEEDED);
        },
        (_error) => {
          setApiStatus(DOWNLOAD_STATUS.FAILED);
        },
      );
  }, [download, id, record?.title]);

  const handleUpload = useCallback(
    (file: File) => {
      setUploadStatus(DOWNLOAD_STATUS.LOADING);
      if (!id) {
        return;
      }

      upload({
        document: file,
        project: id,
      })
        .unwrap()
        .then(
          (_successData) => {
            setUploadStatus(DOWNLOAD_STATUS.SUCCEEDED);
            navigateToRoute('samplingPlanList');
          },
          (error) => {
            const errorMessage =
              error.originalStatus === 500
                ? 'There is a error on the server'
                : error.data;
            setErrorMessage(errorMessage);
            setUploadStatus(DOWNLOAD_STATUS.FAILED);
          },
        );
    },
    [id, navigateToRoute, upload],
  );

  const onClickTemplateDownload = useMemo(() => {
    if (process.env['NX_TEMPLATE_URL']) return process.env['NX_TEMPLATE_URL'];
    return `https://tes-platform-server.fluxility.dev/static/template.xlsx`;
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      handleUpload(acceptedFiles?.[0] as File);
    },
    [handleUpload],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="sampling-plan-modal-title"
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
        <ModalTitleBar title={'Sampling Plan'} onClose={onClose} />
        <Box sx={{ mx: 4, mb: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ maxWidth: '720px', margin: '32px auto 0' }}>
                <Typography variant="h4" mb={2}>
                  Import / Export of the sampling plan
                </Typography>
                <Typography>
                  On the left-hand side of the application, you’ll find an
                  export function that allows you to download all scenarios
                  linked to the project. This provides a convenient overview of
                  all data in a single file. Additionally, there’s an import
                  function where you can upload an Excel file to add new
                  scenarios. Please ensure the Excel file follows the correct
                  format:
                </Typography>
                <Typography mt={2}>
                  <Typography component="span" fontWeight="bold">
                    Note:
                  </Typography>{' '}
                  The fields OEL Source, Action level Source, Hazard CAS-number,
                  and Hazard are not automatically created by the application.
                  It is therefore essential to ensure these fields are spelled
                  correctly to avoid errors.
                </Typography>

                <Typography variant="h6" mt={2}>
                  Template
                </Typography>
                <Typography>
                  Below you will find the column names that are used by the
                  importer to read the data. Also you can download a template
                  excel with data of the server and dropdowns
                </Typography>
                <Button
                  href={onClickTemplateDownload}
                  download
                  sx={{ mt: 2 }}
                  target="_blank"
                  variant="outlined"
                >
                  Download the excel template
                </Button>
                <Box sx={{ width: '100%' }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headcells.map((item) => (
                            <TableCell
                              key={item}
                              style={{ top: 57, minWidth: '150px' }}
                            >
                              {item}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item md={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">
                      Export of the current sampling plan
                    </Typography>
                    <Button
                      sx={{ my: 3 }}
                      variant="contained"
                      onClick={downloadSamplingPlan}
                    >
                      Export
                    </Button>

                    {apiStatus === DOWNLOAD_STATUS.FAILED && (
                      <Alert severity="error">
                        There has been a error on the server with the export
                      </Alert>
                    )}
                  </Box>
                </Grid>
                <Grid item md={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography mb={3} variant="h6">
                      Import of the sampling plan
                    </Typography>
                    <Dropzone
                      accept={{
                        'application/vnd.ms-excel': ['.xlsx', '.xlsm'],
                      }}
                      noClick={false}
                      onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <Box {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Button
                              sx={{
                                width: 'fit-content',
                                px: 5,
                                height: '150px',
                                border: '2px dashed #cccccc',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'border .24s ease-in-out',
                              }}
                              variant="outlined"
                              fullWidth={false}
                              size="large"
                              id={id}
                            >
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <UploadFile fontSize="large" />
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  mt={1}
                                >
                                  Import sampling plan
                                </Typography>
                              </Box>
                            </Button>
                          </Box>
                        </section>
                      )}
                    </Dropzone>
                    {uploadStatus === DOWNLOAD_STATUS.SUCCEEDED && (
                      <Alert sx={{ mt: 3 }} severity="success">
                        The upload is successfull
                      </Alert>
                    )}
                    {uploadStatus === DOWNLOAD_STATUS.FAILED && (
                      <Alert sx={{ mt: 3 }} severity="error">
                        {errorMessage}
                      </Alert>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}
