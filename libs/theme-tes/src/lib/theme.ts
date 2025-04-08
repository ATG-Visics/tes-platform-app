import { createTheme, ThemeOptions } from '@mui/material/styles';
import { DefaultTheme } from '@mui/styles';

import { usePalette } from './palette';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import * as colors from '@tes/ui/colors';

const useGlobalOverrides = <T extends DefaultTheme>(theme: T) => {
  const { palette } = theme;

  return createTheme(theme, {
    typography: {
      fontFamily: ['roboto'].join(','),
    },
    components: {
      MuiCssBaseline: {
        // WIP: MUI advices a css string but a style object is still possible.
        //      However, for this particular component, there is no css autocompletion
        //      for both the css object and string
        styleOverrides: `
            html, body {
              min-height: 100%;
              color: ${colors.accent1['700']};
            }

            body {
              background-color: #FBFCFD;
              margin: 0;
            }
          `,
      },

      MuiInputBase: {
        styleOverrides: {
          input: {
            '&:-internal-autofill-selected': {
              // Monky patch background-color since using background-color
              // won't have any effect
              boxShadow:
                'inset 0 0 0 1px rgba(255, 255, 255, 0), inset 0 0 0 100px rgba(255, 255, 255,1)',
            },
          },
        },
      },

      MuiLink: {
        styleOverrides: {
          root: {
            color: palette.primary.main,
            textDecoration: 'underline',
          },
          underlineHover: {
            textDecoration: 'underline',

            '&:hover': {
              textDecoration: 'none',
            },
          },
        },
      },
    },
  } as ThemeOptions);
};

export function applyTheme<T extends DefaultTheme>(theme: T) {
  let nextTheme = usePalette(theme);
  nextTheme = useGlobalOverrides(nextTheme);

  return nextTheme;
}
