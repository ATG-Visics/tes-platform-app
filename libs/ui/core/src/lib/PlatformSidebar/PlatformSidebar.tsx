import { Backdrop, Box, Toolbar, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';
import clsx from 'clsx';

import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import { H6 } from '../Typography';

interface IProps {
  open?: boolean;
  children: ReactNode;
  onToggleSidebar: (open: boolean) => void;
}

export type PlatformSidebarProps = IProps;
export const PlatformSidebarComponentName = 'IuiPlatformSidebar';

const useStyles = makeStyles(
  ({ palette, spacing }) => ({
    root: {
      maxWidth: 276 + 32,
      width: '100%',
      flexGrow: 1,
      minHeight: '100%',
      zIndex: 1,
      pointerEvents: 'none',
    },

    toolbar: {
      height: 80,
    },

    open: {
      zIndex: 2,
      backgroundColor: palette.background.paper,
      pointerEvents: 'all',

      '&::after': {
        content: '" "',
        display: 'block',
        width: 16,
        minHeight: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.05));',
      },
    },
    closed: {
      minWidth: 64,
      width: 64,
    },

    variantFixed: {
      position: 'absolute',

      '&$closed': {
        backgroundColor: 'transparent',
      },

      '&$open': {
        position: 'relative',
      },
    },

    variantTemporary: {
      position: 'absolute',
    },

    inner: {},

    backdrop: {
      zIndex: 1,
      position: 'absolute',
    },

    toggleButton: {
      marginRight: spacing(-2),
    },

    sidebarOpenButton: {
      pointerEvents: 'all',
      borderTopRightRadius: '20px',
      borderBottomRightRadius: '20px',
      width: '100%',

      '& svg': {
        fontSize: 22,
      },
    },
  }),
  { name: PlatformSidebarComponentName },
);

export type PlatformSidebarClassNames = keyof ReturnType<typeof useStyles>;

export function PlatformSidebar(props: IProps) {
  // open = true is necessary to satisfy typescript because it doesn't know
  // defaultProps.open is set to true by default
  const { open = true, children, onToggleSidebar } = props;
  const isSmallScreen = useMediaQuery('(max-width:1320px)');
  const classes = useStyles();

  return (
    <>
      <div
        className={clsx(classes.root, {
          [classes.open]: open,
          [classes.closed]: !open,
          [classes.variantFixed]: !isSmallScreen,
          [classes.variantTemporary]: isSmallScreen,
        })}
      >
        <div className={classes.inner}>
          <Toolbar
            classes={{
              root: classes.toolbar,
            }}
            disableGutters
          >
            <IconButton
              style={open ? { display: 'none' } : {}}
              color="primary"
              variant="contained"
              aria-label="Toggle table of contents"
              className={classes.sidebarOpenButton}
              icon={<Icon icon="book" prefix="fas" />}
              onClick={() => onToggleSidebar(!open)}
            />

            <Box
              px={2}
              width="100%"
              display={open ? 'flex' : 'none'}
              alignItems="center"
            >
              <Icon icon="book" prefix="fas" />
              <Box mr={2} aria-hidden="true" />
              <H6 component="p">Overzicht</H6>
              <Box flexGrow={1} aria-hidden="true" />
              <IconButton
                className={classes.toggleButton}
                onClick={() => onToggleSidebar(!open)}
                icon={<Icon icon="chevron-left" prefix="fas" />}
              />
            </Box>
          </Toolbar>

          {open && <div>{children}</div>}
        </div>
      </div>

      {isSmallScreen && (
        <Backdrop
          className={classes.backdrop}
          open={open}
          onClick={() => onToggleSidebar(false)}
        />
      )}
    </>
  );
}

PlatformSidebar.defaultProps = {
  open: true,
} as IProps;
