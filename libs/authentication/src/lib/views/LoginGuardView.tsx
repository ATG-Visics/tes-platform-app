import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useAuth } from 'react-oidc-context';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../authentication.slice';
import { useAutoSignin } from '../hooks';
import { messages } from '../messages';
import { AuthenticationSplash } from '../ui';

export function LoginGuardView(_props: unknown) {
  const { formatMessage } = useIntl();
  const auth = useAuth();
  const isStateAuthenticated = useSelector(selectIsAuthenticated);

  useAutoSignin();

  const loginButtonHandler = useCallback(() => auth.signinRedirect(), [auth]);

  if (auth.activeNavigator) {
    return (
      <AuthenticationSplash
        isError={false}
        label={formatMessage(messages[auth.activeNavigator])}
        isPending={true}
      />
    );
  }

  if (auth.isLoading) {
    return (
      <AuthenticationSplash
        isError={false}
        label={formatMessage(messages.loading)}
        isPending={true}
      />
    );
  }

  if (auth.error) {
    return (
      <AuthenticationSplash
        isError={true}
        label={`${auth.error.message}`}
        isPending={false}
        onClickLogin={loginButtonHandler}
        loginButtonLabel={formatMessage(messages.retryLogin)}
      ></AuthenticationSplash>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <AuthenticationSplash
        isError={false}
        label={formatMessage(messages.notAuthenticated)}
        isPending={false}
        onClickLogin={loginButtonHandler}
        loginButtonLabel={formatMessage(messages.login)}
      />
    );
  }

  if (!isStateAuthenticated) {
    return (
      <AuthenticationSplash
        isError={false}
        label={formatMessage(messages.loading)}
        isPending={true}
      />
    );
  }

  return null;
}
