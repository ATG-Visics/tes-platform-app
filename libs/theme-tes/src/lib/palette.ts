import { SimplePaletteColorOptions } from '@mui/material';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { DefaultTheme } from '@mui/styles';

import * as colors from '@tes/ui/colors';

export const usePalette = <T extends DefaultTheme>(theme: T) => {
  const { palette } = theme;

  // Gray
  const accent1: Required<SimplePaletteColorOptions> = {
    light: colors.accent1['200'],
    main: colors.accent1['700'],
    dark: colors.accent1['900'],
    contrastText: palette.getContrastText(colors.accent1['900']),
  };

  // Green
  const accent2: Required<SimplePaletteColorOptions> = {
    light: colors.accent2['100'],
    main: colors.accent2['300'],
    dark: colors.accent2['900'],
    contrastText: palette.getContrastText(colors.accent2['900']),
  };

  return createTheme(theme, {
    palette: {
      primary: accent1,
      secondary: accent2,
    },
    // cast to ThemeOptions because createTheme treats remaining objects as `object`
  } as ThemeOptions);
};
