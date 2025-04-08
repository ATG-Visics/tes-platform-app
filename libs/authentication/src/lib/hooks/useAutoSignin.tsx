import { useEffect, useMemo, useState } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { useLocation } from 'react-router-dom';

export function useAutoSignin() {
  const auth = useAuth();
  const { search } = useLocation();

  const [hasTriedAutoSignin, setHasTriedAutoSignin] = useState(false);

  const noAutoSignin = useMemo(
    () => new URLSearchParams(search).get('noAutoSignin') ?? false,
    [search],
  );

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading &&
      !hasTriedAutoSignin &&
      !noAutoSignin
    ) {
      auth.signinRedirect();
      setHasTriedAutoSignin(true);
    }
  }, [auth, hasTriedAutoSignin, noAutoSignin]);

  return { hasTriedAutoSignin };
}
