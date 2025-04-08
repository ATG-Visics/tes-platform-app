import { useAuth } from 'react-oidc-context';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../authentication.slice';
import { LoginGuardView } from '../views';
import {
  ACCOUNT_STATUS,
  SelectAccountView,
  selectHasSelectedAccount,
} from '@tes/accounts';
import { MuiApp } from '@tes/ui/app';

export function withLoginGuard<P>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const auth = useAuth();

    const isStateAuthenticated = useSelector(selectIsAuthenticated);
    const isStateAccountSelect = useSelector(selectHasSelectedAccount);

    if (!(auth.isAuthenticated && isStateAuthenticated)) {
      return (
        <MuiApp>
          <LoginGuardView />
        </MuiApp>
      );
    }

    if (
      auth.isAuthenticated &&
      isStateAccountSelect !== ACCOUNT_STATUS.LOADED
    ) {
      return (
        <MuiApp>
          <SelectAccountView />
        </MuiApp>
      );
    }

    return <Component {...props} />;
  };
}
