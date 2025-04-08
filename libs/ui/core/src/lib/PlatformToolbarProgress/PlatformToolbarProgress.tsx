import { LinearProgress, LinearProgressProps } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface IProps extends LinearProgressProps {
  value: number;
}

export type PlatformToolbarProgressProps = IProps;

export const PlatformToolbarProgresComponentName = 'IuiPlatformToolbarProgress';
const useStyles = makeStyles(
  () => ({
    root: {
      width: '100%',
      position: 'absolute',
      left: 0,
      bottom: -6,
      height: 6,
    },
    colorPrimary: {
      backgroundColor: 'rgba(0,0,0,0)',
      backgroundImage:
        'linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.05));',
    },
    bar: {
      // Handle to allow override. Without the color can not be overridden.
    },
  }),
  { name: PlatformToolbarProgresComponentName },
);
export type PlatformToolbarProgressClassNames = keyof ReturnType<
  typeof useStyles
>;

export function PlatformToolbarProgress(props: IProps) {
  const classes = useStyles();

  return <LinearProgress classes={classes} {...props} />;
}

PlatformToolbarProgress.defaultProps = {
  value: 0,
  variant: 'determinate',
} as IProps;
