import React, { FormEvent, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { H1 } from '@tes/ui/core';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';
import { SampleMediaDeletePage } from '../../views';
import { FormTheme } from '@tes/ui/form';

const useStyles = makeStyles(({ spacing, breakpoints, typography }) => ({
  root: {
    marginBottom: spacing(4),
    maxWidth: 720,

    [breakpoints.down('lg')]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  form: {
    maxWidth: 409,
    padding: spacing(4),
  },
  fieldLabel: {
    fontSize: typography.pxToRem(16),
    color: 'rgba(0,0,0,0.6)',
  },
  subtitle: {
    marginTop: 4,
    color: 'rgba(0,0,0,0.54)',
    fontSize: typography.pxToRem(12),
  },
  locationForm: {
    width: '100%',
    maxWidth: 720,
    padding: spacing(4),
  },
  mapsContainer: {
    height: 300,
    width: '100%',
    backgroundColor: '#efefef',
  },
  buttonDouble: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing(2),
  },
  buttonSingle: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    color: '#e53935',
    borderColor: '#e53935',

    '&:hover, &:focus': {
      color: '#b71c1c',
      borderColor: '#b71c1c',
    },
  },
}));

interface IFullPageContent {
  title: string;
  description: string;
  formElement: React.ReactNode;
  hasDelete: boolean;
  deleteTitle?: string;
  onConfirmDelete?: () => void;
  saveTitle?: string;
  recordId: string | undefined;
  modalName: string | null;
  onFormSubmit: (e: FormEvent) => void;
  hasFormErrors?: boolean;
}

export function FullPageContent(props: IFullPageContent) {
  const classes = useStyles();
  const {
    title,
    description,
    formElement,
    hasDelete,
    deleteTitle,
    onConfirmDelete,
    saveTitle,
    modalName,
    recordId,
    onFormSubmit,
    hasFormErrors,
  } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Helmet>
        <title>{title} | myIH</title>
      </Helmet>

      <Container className={classes.root}>
        <Box>
          <H1 variant="h4" strong>
            {title}
          </H1>
        </Box>
        <Box mt={1}></Box>
        <Typography variant="body2">{description}</Typography>

        <Box mt={4}></Box>

        <form onSubmit={onFormSubmit}>
          <FormTheme>{formElement}</FormTheme>

          <Box
            sx={{ mt: 4 }}
            className={clsx({
              [classes.buttonDouble]: hasDelete,
              [classes.buttonSingle]: !hasDelete,
            })}
          >
            {hasDelete && (
              <Button
                onClick={handleOpen}
                variant="outlined"
                className={classes.deleteButton}
                sx={{ mr: 2 }}
              >
                {deleteTitle}
              </Button>
            )}

            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={hasFormErrors}
            >
              {saveTitle}
            </Button>
          </Box>
        </form>
        <SampleMediaDeletePage
          onConfirm={onConfirmDelete}
          onCancel={handleClose}
          open={open}
          onClose={handleClose}
          modalName={modalName}
          recordId={recordId}
        />
      </Container>
    </>
  );
}
