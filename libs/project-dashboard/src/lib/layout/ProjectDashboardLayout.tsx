import { useEffect, useMemo, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { DOWNLOAD_STATUS, useDownloadHooks, useRecord } from '@tes/utils-hooks';
import { ProjectDashboardHeader } from '../ui';
import {
  useDownloadAllSubjectPDFStarterMutation,
  useDownloadAllSubjectPDFStatusQuery,
  useDownloadExcelFileStarterMutation,
  useDownloadExcelFileStatusQuery,
  useGetProjectByIdQuery,
} from '@tes/project';
import dayjs, { Dayjs } from 'dayjs';
import { TransitionsModal } from '@tes/ui/core';

export function ProjectDashboardLayout() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [savedDate, setSavedDate] = useState<string>('');
  const [open, setOpen] = useState(true);

  const selectedDate = useMemo(() => {
    return (
      searchParams.get('selectedDate') ||
      savedDate ||
      dayjs(new Date()).format('YYYY-MM-DD')
    );
  }, [searchParams, savedDate]);

  const setSelectedDate = (newDate: Dayjs) => {
    const formattedDate = newDate.format('YYYY-MM-DD');
    setSavedDate(formattedDate);
  };

  useEffect(() => {
    if (!selectedDate) {
      setSavedDate(
        searchParams.get('selectedDate') ||
          dayjs(new Date()).format('YYYY-MM-DD'),
      );
    }

    if (searchParams.get('selectedDate') === savedDate) return;
    setSearchParams({ selectedDate: savedDate || selectedDate || '' });
  }, [selectedDate, setSearchParams, savedDate, searchParams]);

  const selectedDayjsDate = dayjs(selectedDate);
  const { record, recordId } = useRecord({
    useRecordQuery: useGetProjectByIdQuery,
  });

  const { onClickDownload, downloadStatus, downloadError } = useDownloadHooks({
    useStartMutation: useDownloadExcelFileStarterMutation,
    useStatusQuery: useDownloadExcelFileStatusQuery,
  });

  const {
    onClickDownload: onClickDownloadSubjects,
    downloadStatus: subjectDownloadStatus,
    downloadError: subjectDownLoadError,
  } = useDownloadHooks({
    useStartMutation: useDownloadAllSubjectPDFStarterMutation,
    useStatusQuery: useDownloadAllSubjectPDFStatusQuery,
  });

  return (
    <>
      {downloadStatus === DOWNLOAD_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred when downloading the excel from the server"
          description={downloadError}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {subjectDownloadStatus === DOWNLOAD_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred when downloading the PDF from the server"
          description={subjectDownLoadError}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      <Box sx={{ display: 'flex', mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <ProjectDashboardHeader
            onClickDownload={() =>
              onClickDownload(recordId || '', `${record?.title}`)
            }
            onClickDownloadSubjects={(from, to) => {
              onClickDownloadSubjects(
                { project: recordId || '', fromDate: from, toDate: to } || '',
                `All subject of project: ${record?.title}`,
                true,
              );
            }}
            downloadStatus={downloadStatus}
            subjectDownloadStatus={subjectDownloadStatus}
            title={record?.title || ''}
            subtitle={record?.contactPerson || ''}
            country={record?.country || ''}
            selectedDate={selectedDayjsDate}
          />
          <Box height="230px" />
          <Outlet
            context={{ selectedDate: selectedDayjsDate, setSelectedDate }}
          />
        </Box>
      </Box>
    </>
  );
}
