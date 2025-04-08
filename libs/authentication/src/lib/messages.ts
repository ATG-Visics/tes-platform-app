import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  loading: {
    id: 'authentication.loading',
    defaultMessage: 'Loading',
  },
  signinRedirect: {
    id: 'authentication.signinRedirect',
    defaultMessage: 'You are redirected to the login',
  },
  signinResourceOwnerCredentials: {
    id: 'authentication.signinResourceOwnerCredentials',
    defaultMessage: 'Sign in',
  },
  signinPopup: {
    id: 'authentication.signinPopup',
    defaultMessage: 'Sign in with a popup screen',
  },
  signoutPopup: {
    id: 'authentication.signoutPopup',
    defaultMessage: 'You can sign out with a popup screen',
  },
  signoutSilent: {
    id: 'authentication.signoutSilent',
    defaultMessage: 'Je will be signed out',
  },
  signinSilent: {
    id: 'authentication.signinSilent',
    defaultMessage: 'Sign in',
  },
  signoutRedirect: {
    id: 'authentication.signoutRedirect',
    defaultMessage: 'You are redirected to sign out',
  },
  notAuthenticated: {
    id: 'authentication.notAuthenticated',
    defaultMessage: 'You are not signed in',
  },
  retryLogin: {
    id: 'authentication.retryLogin',
    defaultMessage: 'Try logging in again',
  },
  login: {
    id: 'authentication.login',
    defaultMessage: 'Logging in',
  },
  unknownError: {
    id: 'authentication.unknownError',
    defaultMessage: 'Error unknown',
  },
});
