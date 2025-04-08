import { Box, Button, Typography } from '@mui/material';
import { SUBJECT_STATUS, useGetSubjectWithSamples } from '../../hooks';
import { AreaSampleSubjectListItem } from '../../ui';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import { Add as AddIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';
import { useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import {
  useDownloadPersonSubjectPDFStarterMutation,
  useDownloadPersonSubjectPDFStatusQuery,
} from '@tes/person-subject-api';
import {
  useDownloadAreaSubjectPDFStarterMutation,
  useDownloadAreaSubjectPDFStatusQuery,
} from '@tes/area-subject-api';
import {
  DOWNLOAD_STATUS,
  ISubmissionError,
  useDownloadHooks,
} from '@tes/utils-hooks';

interface IProps {
  surveyMomentId: {
    project: string;
    startDate: string;
  };
}

export function AreaSampleSubjectListPage(props: IProps) {
  const isClient = useSelector(selectIsClient);
  const { surveyMomentId } = props;
  const { navigateToRoute } = useCustomNavigate();
  const { id = '' } = useParams();
  const [hasError, setHasError] = useState<{
    hasError: boolean;
    errorMessage: null | ISubmissionError;
  }>({ hasError: false, errorMessage: null });
  const [open, setOpen] = useState(true);

  const { subjectList, subjectStatus } = useGetSubjectWithSamples({
    surveyMomentId: surveyMomentId,
  });

  const {
    onClickDownload: onClickAreaDownload,
    downloadStatus: areaDownloadStatus,
    downloadError: areaDownloadError,
  } = useDownloadHooks({
    useStartMutation: useDownloadAreaSubjectPDFStarterMutation,
    useStatusQuery: useDownloadAreaSubjectPDFStatusQuery,
  });

  const {
    onClickDownload: onClickPersonDownload,
    downloadStatus: personDownloadStatus,
    downloadError: personDownloadError,
  } = useDownloadHooks({
    useStartMutation: useDownloadPersonSubjectPDFStarterMutation,
    useStatusQuery: useDownloadPersonSubjectPDFStatusQuery,
  });

  const handleDownloadPdf = useCallback(
    (subjectId, subjectType, fileName) => {
      setOpen(true);
      if (subjectType === 'person') {
        onClickPersonDownload(subjectId, fileName, true);
      } else {
        onClickAreaDownload(subjectId, fileName, true);
      }
    },
    [onClickAreaDownload, onClickPersonDownload],
  );

  return (
    <>
      {subjectStatus === SUBJECT_STATUS.FAILED && <PageNotFound />}

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
      {personDownloadStatus === DOWNLOAD_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred when downloading the PDF form the server"
          description={personDownloadError}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
      {areaDownloadStatus === DOWNLOAD_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred when downloading the PDF form the server"
          description={areaDownloadError}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: { xs: 2, sm: 0 } }}>
          Samples & Subjects
        </Typography>
        {!isClient && (
          <Button
            variant="contained"
            onClick={() =>
              navigateToRoute('subjectAreaCreate', { params: { id } })
            }
          >
            <AddIcon sx={{ mr: 1 }} />
            Add Area
          </Button>
        )}
        {!isClient && (
          <Button
            variant="contained"
            onClick={() =>
              navigateToRoute('subjectPersonCreate', {
                params: { id },
              })
            }
          >
            <AddIcon sx={{ mr: 1 }} />
            Add Person
          </Button>
        )}
      </Box>

      <AreaSampleSubjectListItem
        isClient={isClient}
        emptyMessage="No area samples found"
        surveyMomentId={surveyMomentId}
        subjectList={subjectList}
        handleDownloadPdf={handleDownloadPdf}
      />
    </>
  );
}
