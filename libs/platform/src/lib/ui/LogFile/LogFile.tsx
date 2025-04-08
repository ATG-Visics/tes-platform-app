import React from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Link,
  Modal,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';

interface IProps {
  file: {
    file: string;
    url: string;
    mimetype: string;
    name: string;
  };
}

export type LogFileProps = IProps;

export function LogFile(props: IProps) {
  const { file } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderFileType = () => {
    if (file.mimetype?.includes('image')) {
      return (
        <Link
          onClick={handleOpen}
          sx={{ display: 'flex', alignSelf: 'center' }}
        >
          <Box
            component="img"
            src={file.file}
            alt="log-message-alt"
            sx={{
              objectFit: 'contain',
              maxWidth: 250,
              maxHeight: 250,
              alignSelf: 'center',
              color: '#fff',
              width: '100%',
            }}
          />
        </Link>
      );
    } else if (file.mimetype?.includes('pdf')) {
      return (
        <Box
          sx={{
            display: 'flex',
            height: '100px',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            p: 2,
          }}
        >
          <PictureAsPdfIcon
            sx={{
              height: '40px',
              width: '40px',
              fill: '#fff',
            }}
          />
          <Typography variant="subtitle2" sx={{ color: '#fefefe' }}>
            PDF viewer is not supported.
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            display: 'flex',
            height: '100px',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            p: 2,
          }}
        >
          <InsertDriveFileOutlinedIcon
            sx={{
              height: '40px',
              width: '40px',
              fill: '#fff',
            }}
          />
          <Typography variant="subtitle2" sx={{ color: '#fefefe' }}>
            Preview not supported for filetype.
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        position: 'relative',
        maxWidth: 250,
      }}
    >
      {renderFileType()}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#fefefe',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginRight: 1,
          }}
        >
          {file.name}
        </Typography>

        <IconButton
          href={file.file}
          aria-label="Download"
          download
          target="_blank"
        >
          <FileDownloadIcon sx={{ fill: '#fff' }} />
        </IconButton>
      </Box>

      <Modal
        open={open}
        onClose={(_event, reason) => {
          if (reason === 'escapeKeyDown') {
            handleClose();
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '60%',
            maxHeight: '60%',
            height: '100%',
            backgroundColor: 'background.paper',
            boxShadow: 24,
            mx: 'auto',
            p: 4,
            pt: 12,
            outline: 'none',
            '& img': {
              maxWidth: '100% !important',
              maxHeight: '100% !important',
              height: '100%',
              width: '100%',
            },
            '& a': {
              height: '100%',
              width: '100%',
            },
          }}
        >
          <AppBar color="secondary" elevation={0}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" color="#fff">
                File preview
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon sx={{ fill: '#fff' }} />
              </IconButton>
            </Toolbar>
          </AppBar>

          {renderFileType()}
        </Box>
      </Modal>
    </Box>
  );
}
