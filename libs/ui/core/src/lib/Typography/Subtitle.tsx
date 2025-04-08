import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

import { Text, TextProps } from './Text';

const useStyles = makeStyles(
  ({ palette }) => ({
    root: {},
    active: {
      color: palette.primary.main,
    },
    inactive: {
      color: palette.primary.light,
    },
  }),
  { name: 'IuiSubtitle' },
);

export function Subtitle({
  variant = 'subtitle2',
  state,
  ...rest
}: TextProps & { state?: 'active' | 'inactive' }) {
  const classes = useStyles();

  return (
    <Text
      className={clsx(classes.root, {
        [classes.active]: state === 'active',
        [classes.inactive]: state === 'inactive',
      })}
      variant={variant}
      {...rest}
    />
  );
}

export default Subtitle;
