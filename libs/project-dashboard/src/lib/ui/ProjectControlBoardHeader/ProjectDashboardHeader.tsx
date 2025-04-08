import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { ProjectDashboardTabs } from '../index';
import * as colors from '@tes/ui/colors';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';
import { Dayjs } from 'dayjs';
import { LoadingButton } from '@mui/lab';
import { DOWNLOAD_STATUS } from '@tes/utils-hooks';
import { DownloadSubjectsButton } from '../DownloadSubjectsButton';

interface IProps {
  selectedDate: Dayjs;
  title: string;
  subtitle: string;
  country: string;
  onClickDownload: () => void;
  onClickDownloadSubjects: (from?: string, to?: string) => void;
  downloadStatus: DOWNLOAD_STATUS;
  subjectDownloadStatus: DOWNLOAD_STATUS;
}

export function ProjectDashboardHeader(props: IProps) {
  const isClient = useSelector(selectIsClient);
  const {
    onClickDownload,
    title,
    subtitle,
    country,
    selectedDate,
    onClickDownloadSubjects,
    downloadStatus,
    subjectDownloadStatus,
  } = props;

  const { navigateToRoute } = useCustomNavigate();

  return (
    <>
      <AppBar color="secondary" elevation={0}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ color: '#fff' }}>
            <Button
              color="inherit"
              onClick={() => navigateToRoute('projectList')}
              sx={{ pl: 0 }}
            >
              <ChevronLeftIcon /> Back
            </Button>
          </Box>
          <Box>
            {!isClient && (
              <Box>
                <DownloadSubjectsButton
                  onClickDownloadSubjects={onClickDownloadSubjects}
                  subjectDownloadStatus={subjectDownloadStatus}
                />
                <LoadingButton
                  onClick={onClickDownload}
                  startIcon={<DownloadIcon />}
                  loading={downloadStatus === DOWNLOAD_STATUS.LOADING}
                  loadingPosition="start"
                  variant="contained"
                >
                  Download Excel
                </LoadingButton>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: colors.accent2['300'],
          color: '#fff',
          boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 25%)',
          width: '100%',
          mt: 6,
          position: 'fixed',
          zIndex: 2,
        }}
      >
        <Container>
          <Box
            sx={{
              p: 2,
              pb: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, fontSize: '1.125rem' }}
            >
              {title}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.875rem' }}>
              {subtitle}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.875rem' }}>
              {country}
            </Typography>
          </Box>
          <Box>
            <ProjectDashboardTabs selectedDate={selectedDate} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
