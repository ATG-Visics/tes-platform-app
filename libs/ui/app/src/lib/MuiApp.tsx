import { CssBaseline } from '@mui/material';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { applyTheme } from '@tes/theme-tes';
import { GlobalCssPriority } from './GlobalCssPriority';
import { IntlProvider } from 'react-intl';

const defaultTheme = applyTheme(createTheme());

export function MuiApp({
  children,
  theme = defaultTheme,
}: {
  children: React.ReactNode;
  theme?: Theme;
}) {
  return (
    <GlobalCssPriority>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <IntlProvider locale="nl" defaultLocale="nl">
          {children}
        </IntlProvider>
      </ThemeProvider>
    </GlobalCssPriority>
  );
}
