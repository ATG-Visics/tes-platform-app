import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
  useMediaQuery,
} from '@mui/material';
import logoUrl from './logo.svg';
import splashBackground from './splash-background.jpg';

interface IProps {
  isPending: boolean;
  isError: boolean;
  label: string;
  loginButtonLabel?: string;
  onClickLogin?: () => void;
}

export type AuthenticationSplashProps = IProps;

export function AuthenticationSplash(props: IProps) {
  const { label, isPending, isError, onClickLogin, loginButtonLabel } = props;
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        background: `url(${splashBackground}) no-repeat center/cover`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        height: '100%',
        width: '100vw',
        position: 'relative',
        mb: '-24px',
      }}
    >
      <Container sx={{ zIndex: 2 }}>
        <Box
          sx={{
            maxWidth: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isSmallScreen ? 'flex-start' : 'center',
            mt: isSmallScreen ? 5 : 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              borderRadius: '8px',
              backgroundColor: '#fff',
              padding: 3,
              width: '100%',
              maxWidth: 550,
            }}
          >
            <Box
              component="img"
              src={logoUrl}
              sx={{
                maxHeight: '50px',
                maxWidth: '550px',
                height: '100%',
                mb: 2,
              }}
              alt="myIH"
            />

            {isPending && (
              <Box sx={{ margin: 4, width: '100%', maxWidth: 280 }}>
                <LinearProgress color="secondary" />
              </Box>
            )}

            {label && (
              <Typography
                sx={{
                  color: isError ? 'red' : 'inherit',
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                {label}
              </Typography>
            )}

            {loginButtonLabel && (
              <Button
                variant="contained"
                size="medium"
                onClick={onClickLogin}
                color="primary"
              >
                {loginButtonLabel}
              </Button>
            )}
          </Box>
        </Box>
      </Container>
      <Box
        sx={{
          backgroundColor: 'rgb(117 164 163 / 90%)',
          minHeight: '100vh',
          height: '100%',
          width: '100vw',
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: 1,
        }}
      />
    </Box>
  );
}
