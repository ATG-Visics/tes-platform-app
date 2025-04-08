import { useGetAllAccountsQuery } from '../../api';
import { ACCOUNT_STATUS, accountsActions } from '../../accounts.slice';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';
import logoUrl from './logo.svg';
import splashBackground from './splash-background.jpg';
import { mapListResult } from '@tes/utils-hooks';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from 'react-oidc-context';
import { useCustomNavigate } from '@tes/router';

export function SelectAccountView() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { navigateToRoute } = useCustomNavigate();

  const dispatch = useDispatch();
  const auth = useAuth();

  const response = useGetAllAccountsQuery();

  const { itemList } = mapListResult(response.data);

  const submitHandler = useCallback(
    (e, data: string) => {
      e.preventDefault();

      if (!data) {
        return;
      }

      const [uuid, client] = data.split('|');

      dispatch(
        accountsActions.updateUserAccount({
          selectedAccount: ACCOUNT_STATUS.LOADED,
          accountId: uuid,
        }),
      );

      dispatch(
        accountsActions.updateIsClient({
          isClient: client.trim() === 'true',
        }),
      );
      navigateToRoute('dashboard');
    },
    [dispatch, navigateToRoute],
  );

  const handleSignOut = useCallback(() => {
    auth.signoutRedirect();

    dispatch(
      accountsActions.updateUserAccount({
        selectedAccount: ACCOUNT_STATUS.IDLE,
        accountId: null,
      }),
    );
  }, [auth, dispatch]);

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
        mb: -3,
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
              alt="Nationale Milieudatabase"
            />

            <Box
              sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}
            >
              <Typography variant="h4">Account selection</Typography>
              <Typography variant="subtitle1">
                Select an account to sign in to
              </Typography>
            </Box>

            {itemList.length >= 1 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexFlow: 'row wrap',
                  justifyContent: 'center',
                }}
              >
                {itemList.map((item, index) => (
                  <Button
                    sx={{ mt: 2, ml: 2 }}
                    variant="contained"
                    key={`${index}_${item.title}`}
                    onClick={(event) =>
                      submitHandler(event, `${item.id}|${item.isClient}`)
                    }
                  >
                    {item.title}
                  </Button>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <Button
              sx={{ mt: 3 }}
              onClick={handleSignOut}
              variant="outlined"
              size="medium"
              color="primary"
            >
              Log out
            </Button>
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
