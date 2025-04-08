import { Box, CircularProgress } from '@mui/material';
import { useGetAccountQuery, useGetProfileQuery } from '../api';
import { UserAccount } from '../ui';
import { useAuth } from 'react-oidc-context';
import { useCallback, useEffect } from 'react';
import {
  ACCOUNT_STATUS,
  accountsActions,
  getAccountId,
} from '../accounts.slice';
import { useDispatch, useSelector } from 'react-redux';

export function UserAccountWidget() {
  const { data, isLoading } = useGetProfileQuery();
  const auth = useAuth();
  const dispatch = useDispatch();
  const accountId = useSelector(getAccountId);
  const account = useGetAccountQuery(accountId);

  const handleSignOut = useCallback(() => {
    auth.signoutRedirect();

    dispatch(
      accountsActions.updateUserAccount({
        selectedAccount: ACCOUNT_STATUS.IDLE,
        accountId: null,
      }),
    );
  }, [auth, dispatch]);

  const handleSwitchAccount = useCallback(() => {
    dispatch(
      accountsActions.updateUserAccount({
        selectedAccount: ACCOUNT_STATUS.IDLE,
        accountId: null,
      }),
    );
    // This always needs to be a link like this to refresh the cache of the RTK Query api's
    window.location.href = `${window.location.origin}/account-select`;
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const fullUserName = `${data.firstName} ${data.lastName}`;
      dispatch(accountsActions.updateFullUserName({ fullUserName }));
    }
  }, [data, dispatch]);

  if (isLoading || data === undefined) {
    return (
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
    );
  }

  return (
    <UserAccount
      name={`${data?.firstName} ${data?.lastName}`}
      account={account.currentData?.title}
      handleSignOut={handleSignOut}
      handleSwitchAccount={handleSwitchAccount}
    />
  );
}
