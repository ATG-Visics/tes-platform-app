import { Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';

import { PlatformToolbarProgress } from '../PlatformToolbarProgress';

interface IProps {
  children: ReactNode;
  actionsSection?: ReactNode;
  progress?: ReactNode;
}

export type DocumentEditorToolbarProps = IProps;

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    paddingTop: 20,
    paddingBottom: 20,
    background: palette.common.white,
    position: 'relative',
    height: 80,
  },
  inner: {
    maxWidth: 980 + spacing(4),
    paddingLeft: spacing(4),
    paddingRight: spacing(4),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  toolbar: {
    minHeight: 0,
  },

  spacer: {
    flexGrow: 0,

    [`@media (min-width: ${1074 + spacing(1)}px)`]: {
      flexGrow: 1,
    },
  },
}));

/**
 *
 * This is the header for main content of the platform. The `children` are the title section. There is an
 * `actionsSection` located at the right side of the toolbar.
 *
 * Design is based on https://app.zeplin.io/project/5e53e4e05fd9de7778b827f1/screen/5e53e61f367b7f67e42e5219
 *
 */
export function PlatformToolbar(props: IProps) {
  const { children, actionsSection, progress } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {progress}
      <div className={classes.inner}>
        <Toolbar className={classes.toolbar} disableGutters>
          {children}
          <div className={classes.spacer} aria-hidden="true" />
          {actionsSection && <div>{actionsSection}</div>}
        </Toolbar>
      </div>
    </div>
  );
}

PlatformToolbar.defaultProps = {
  actionsSection: null,
  progress: <PlatformToolbarProgress />,
} as IProps;
