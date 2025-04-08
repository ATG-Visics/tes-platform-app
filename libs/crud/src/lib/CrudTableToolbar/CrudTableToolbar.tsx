import { Box, Toolbar, Typography } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import clsx from 'clsx';
import * as colors from '@tes/ui/colors';

interface IProps {
  numSelected: number;
}

export type CrudTableToolbarProps = IProps;

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    root: {
      paddingLeft: spacing(2),
      paddingRight: spacing(1),
      color: colors.accent1['700'],
    },
    highlight: {
      backgroundColor: colors.accent1['50'],
    },
    actions: {
      display: 'flex',
      gap: spacing(1),
      minWidth: 0,
      flexShrink: 0,
    },
  }),
);

export function CrudTableToolbar(props: IProps) {
  const classes = useStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography color="inherit" variant="body2" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant="subtitle1" component="h2" fontWeight="bold">
          Recent requests
        </Typography>
      )}

      <Box px={2} flexGrow={1} aria-hidden="true" />

      {numSelected > 0 && (
        <Typography>There are no actions available</Typography>
      )}
    </Toolbar>
  );
}
