import { Box, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';

import { CrudActions, CrudActionsProps } from '../CrudActions';

interface IProps {
  title: string;
  addLabel: string;
  searchFieldPlaceholder?: string;
  searchValue?: string;
  onSearchChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onAddClick: CrudActionsProps['onAddClick'];
  showAddButton?: boolean;
  hasExtraButton?: boolean;
  extraButtonTitle?: string;
  extraButtonHandler?: () => void;
}

export type CrudListPageToolbarProps = IProps;

export function CrudListPageToolbar(props: IProps) {
  const {
    title,
    addLabel,
    searchFieldPlaceholder,
    searchValue,
    onSearchChange,
    onAddClick,
    showAddButton,
    hasExtraButton,
    extraButtonTitle,
    extraButtonHandler,
  } = props;
  return (
    <Toolbar
      disableGutters
      sx={{
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        fontWeight="bold"
        sx={{
          marginBottom: { xs: '16px', md: 0 },
        }}
      >
        {title}
      </Typography>

      {hasExtraButton ? (
        <Box
          px={2}
          flexGrow={1}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button variant="contained" onClick={extraButtonHandler}>
            {extraButtonTitle}
          </Button>
        </Box>
      ) : (
        <Box px={2} flexGrow={1} aria-hidden="true" />
      )}

      <CrudActions
        addLabel={addLabel}
        searchFieldPlaceholder={searchFieldPlaceholder}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onAddClick={onAddClick}
        showAddButton={showAddButton}
      />
    </Toolbar>
  );
}

CrudListPageToolbar.defaultProps = {
  searchFieldPlaceholder: '',
  searchValue: '',
};
