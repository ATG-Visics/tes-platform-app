import { ReactNode, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useDispatch } from 'react-redux';
import { authenticationActions } from '../authentication.slice';

interface IProps {
  children: ReactNode;
}

export function Authentication(props: IProps) {
  const { children } = props;

  const auth = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    if (auth?.user) {
      dispatch(
        authenticationActions.updateUser({
          isAuthenticated: true,
          accessToken: auth.user.access_token,
        }),
      );
    } else {
      dispatch(
        authenticationActions.updateUser({
          isAuthenticated: false,
          accessToken: null,
        }),
      );
    }
  }, [auth?.user, dispatch]);
  return <>{children}</>;
}
