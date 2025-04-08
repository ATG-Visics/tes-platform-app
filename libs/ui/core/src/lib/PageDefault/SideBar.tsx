import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  ListItemButton,
  Box,
  useMediaQuery,
  Backdrop,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { selectIsClient, UserAccountWidget } from '@tes/accounts';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useSidebar, useSidebarState } from './hooks';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCustomNavigate, mainRoutes } from '@tes/router';
import { MuiIcon } from '../Icon';

const drawerWidth = 240;

const useStyles = makeStyles(({ palette }) => ({
  root: {
    zIndex: 2,
    width: 0,
    // quick & dirty animation, not entirely in sync yet because the enter/leave
    // duration differ
    transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1)',
  },
  open: {
    width: drawerWidth,
  },

  iconSelected: {
    color: palette.primary.main,
  },
  link: {
    textDecoration: 'none',
    color: '#000',
  },
  titleSelected: {
    color: palette.primary.main,
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

  backdrop: {
    zIndex: 1,
    position: 'absolute',
  },
}));

export function SideBar() {
  const { navigateToRoute } = useCustomNavigate();
  const sideBarState = useSidebarState();
  const sidebar = useSidebar();
  const classes = useStyles();
  const isSmallScreen = useMediaQuery('(max-width:1320px)');
  const isClient = useSelector(selectIsClient);
  const location = useLocation();

  const menuItems = mainRoutes.filter(
    (route) =>
      route.meta.menuItem &&
      route.meta.roles?.includes(isClient ? 'client' : 'owner'),
  );

  useEffect(() => {
    !isSmallScreen ? sidebar.open() : sidebar.close();
  }, [sidebar, isSmallScreen]);

  const handleClick = useCallback(
    (name: string) => {
      navigateToRoute(name);
      !isSmallScreen ? sidebar.open() : sidebar.close();
    },
    [isSmallScreen, navigateToRoute, sidebar],
  );

  return (
    <>
      <Drawer
        sx={{
          zIndex: 1,
          width: drawerWidth,
          flexShrink: 0,
        }}
        className={clsx(classes.root, {
          [classes.open]: sideBarState.isOpen,
          [classes.variantFixed]: !isSmallScreen,
          [classes.variantTemporary]: isSmallScreen,
        })}
        variant={sideBarState.variant}
        open={sideBarState.isOpen}
        anchor="left"
      >
        <Toolbar />

        <Box sx={{ width: drawerWidth }}>
          <UserAccountWidget />
        </Box>

        <Divider />

        <Box overflow="auto" sx={{ width: drawerWidth }}>
          <List>
            {menuItems.map((menuItem) => {
              const isActive = location.pathname.includes(menuItem.path);

              return (
                <ListItemButton
                  key={menuItem.name}
                  selected={isActive}
                  onClick={() => menuItem.name && handleClick(menuItem.name)}
                >
                  <ListItemIcon sx={isActive ? { color: 'inherit' } : {}}>
                    {menuItem.meta?.icon && (
                      <MuiIcon icon={menuItem.meta?.icon} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={menuItem.meta.title} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {isSmallScreen && (
        <Backdrop
          className={classes.backdrop}
          open={sideBarState.isOpen}
          onClick={sidebar.close}
        />
      )}
    </>
  );
}
