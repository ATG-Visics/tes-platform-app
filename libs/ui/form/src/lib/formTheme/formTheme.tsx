import React, { useMemo } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { deepmerge } from '@mui/utils';

const formTheme = createTheme({
  components: {
    MuiFormControl: {
      defaultProps: {
        sx: {
          my: 1,
          margin: '0 auto',
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          '.Mui-disabled &': {
            WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
          },
        },
      },
    },

    MuiInputLabel: {
      defaultProps: {
        sx: {
          top: 12,
          left: 16,

          '&.MuiInputLabel-shrink': {
            top: 20,
          },
        },
      },
    },

    MuiInputBase: {
      defaultProps: {
        sx: {
          fontSize: 16,
          backgroundColor: 'rgb(0 0 0 / 4%)',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          minHeight: '56px',

          '& .MuiInput-input': {
            pl: 2,
            mb: -2,
          },
          '& .MuiInputAdornment-root': {
            mr: 1,

            '& .MuiButtonBase-root': {
              p: 1,
              fontSize: '1rem',

              '& .MuiSvgIcon-root': {
                backgroundColor: 'transparent !important',
              },
            },
          },

          '& .MuiAutocomplete-input': {
            p: '5px 16px !important',
          },
        },
      },
    },

    MuiStepper: {
      styleOverrides: {
        horizontal: {
          height: '80px',
        },
      },
    },
  },
});

export function FormTheme({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const mergedTheme = useMemo(() => deepmerge(formTheme, theme), [theme]);

  return <ThemeProvider theme={mergedTheme}>{children}</ThemeProvider>;
}
