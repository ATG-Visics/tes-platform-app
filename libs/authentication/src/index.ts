import { User, WebStorageStateStore } from 'oidc-client-ts';

export * from './lib/ui';
export * from './lib/views';
export * from './lib/hooks';
export * from './lib/wrappers';
export * from './lib/authentication.slice';
export { messages } from './lib/messages';

export const getDefaultOidcConfig = () => ({
  redirect_uri: `${window.location.origin}`,
  scope: 'openid introspect profile email',
  post_logout_redirect_uri: `${window.location.origin}?noAutoSignin=true`,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: (_user: User | void): void => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
});
