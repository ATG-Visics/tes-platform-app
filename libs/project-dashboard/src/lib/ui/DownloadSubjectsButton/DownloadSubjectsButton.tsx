import { useEffect, useState, useRef } from 'react';
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Box,
  Typography,
  Menu,
} from '@mui/material';
import { SimCardDownload as SimCardDownloadIcon } from '@mui/icons-material';
import { Dayjs } from 'dayjs';
import { DOWNLOAD_STATUS } from '@tes/utils-hooks';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

interface IProps {
  onClickDownloadSubjects: (from?: string, to?: string) => void;
  subjectDownloadStatus: DOWNLOAD_STATUS;
}

export function DownloadSubjectsButton(props: IProps) {
  const { onClickDownloadSubjects, subjectDownloadStatus } = props;

  const [openMenu, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [downloadAll, setDownloadAll] = useState(true);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleOpenMenu = () => setOpen(true);
  const handleCloseMenu = () => {
    if (subjectDownloadStatus !== DOWNLOAD_STATUS.LOADING) {
      setOpen(false);
    }
  };

  const handleDownload = () => {
    onClickDownloadSubjects(
      fromDate?.format('YYYY-MM-DD') || undefined,
      toDate?.format('YYYY-MM-DD') || undefined,
    );
  };

  const handleDateChange = (
    setter: (date: Dayjs | null) => void,
    newValue: Dayjs | null,
  ) => {
    if (newValue) {
      setDownloadAll(false);
    }
    setter(newValue);
  };

  useEffect(() => {
    if (!toDate && !fromDate) {
      setDownloadAll(true);
    }
  }, [toDate, fromDate]);

  useEffect(() => {
    if (
      subjectDownloadStatus === DOWNLOAD_STATUS.SUCCEEDED ||
      subjectDownloadStatus === DOWNLOAD_STATUS.FAILED
    ) {
      setOpen(false);
    }
  }, [subjectDownloadStatus]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadAll(event.target.checked);
    if (event.target.checked) {
      setFromDate(null);
      setToDate(null);
    }
  };

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={handleOpenMenu}
        startIcon={<SimCardDownloadIcon />}
        variant="contained"
        sx={{ mr: 3 }}
      >
        Download subjects
      </Button>

      <Menu
        anchorEl={buttonRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openMenu}
        onClose={handleCloseMenu}
        PaperProps={{
          style: { width: 300 },
        }}
        sx={{ mt: 1 }}
      >
        {subjectDownloadStatus === 'loading' ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ p: 2 }}
          >
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Preparing download...</Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => handleDateChange(setFromDate, newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ my: 2 }} />
                )}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue) => handleDateChange(setToDate, newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ mb: 2 }} />
                )}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={downloadAll}
                    onChange={handleCheckboxChange}
                    disabled={!fromDate && !toDate}
                  />
                }
                label="Download all subjects"
              />
            </LocalizationProvider>
          </Box>
        )}

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseMenu}
            color="secondary"
            disabled={subjectDownloadStatus === 'loading'}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            variant="contained"
            disabled={subjectDownloadStatus === 'loading'}
          >
            Download
          </Button>
        </Box>
      </Menu>
    </>
  );
}
