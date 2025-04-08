import React from 'react';
import { AppBar, Box, Toolbar, IconButton, Button } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { PageBase, PageBaseProps } from '../PageBase';
import { SideBar } from './SideBar';
import { SidebarProvider, useSidebar } from './hooks';
import { useCustomNavigate } from '@tes/router';

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <AppBar color="secondary" elevation={0}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {children}
      </Toolbar>
    </AppBar>
  );
}

export function DefaultPageHeader({
  hasBackButton,
}: {
  hasBackButton: boolean | undefined;
}) {
  const sidebar = useSidebar();
  const { navigateToRoute } = useCustomNavigate();

  return (
    <PageHeader>
      <Box color="#fff">
        {!hasBackButton ? (
          <IconButton
            color="inherit"
            edge="start"
            aria-label="menu"
            onClick={() => sidebar.toggle()}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Button
            color="inherit"
            onClick={() => navigateToRoute(-1)}
            sx={{
              pl: 0,
            }}
          >
            <ChevronLeftIcon /> Back
          </Button>
        )}
      </Box>
    </PageHeader>
  );
}

export function PageDefault({
  hasBackButton,
  header,
  children,
  footer,
}: PageBaseProps) {
  return (
    <SidebarProvider>
      <PageBase
        header={header || <DefaultPageHeader hasBackButton={hasBackButton} />}
        footer={footer}
      >
        <Box display="flex">
          <SideBar />
          {children}
        </Box>
      </PageBase>
    </SidebarProvider>
  );
}
