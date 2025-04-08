import { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { createStore } from './store';
import { environment } from './environments/environment';

import App from './app/app';
import { Authentication, getDefaultOidcConfig } from '@tes/authentication';
import { FeedbackToastProvider, FeedbackModal } from '@tes/feedback';

library.add(fas);
library.add(fab);

const theme = createTheme();

const oidcConfig: AuthProviderProps = {
  ...getDefaultOidcConfig(),
  authority: environment.OIDC_AUTHORITY,
  client_id: environment.OIDC_CLIENT,
};

const store = createStore();

render(
  <StrictMode>
    <IntlProvider locale="en-US" defaultLocale="en-US">
      <Provider store={store}>
        <AuthProvider {...oidcConfig}>
          <Authentication>
            <HelmetProvider>
              <FeedbackToastProvider>
                <BrowserRouter>
                  <ThemeProvider theme={theme}>
                    <FeedbackModal />
                    <App />
                  </ThemeProvider>
                </BrowserRouter>
              </FeedbackToastProvider>
            </HelmetProvider>
          </Authentication>
        </AuthProvider>
      </Provider>
    </IntlProvider>
  </StrictMode>,
  document.getElementById('root') as HTMLElement,
);
