import React, { FormEvent } from 'react';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { makeStyles } from '@mui/styles';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { H1 } from '@tes/ui/core';
import { Helmet } from 'react-helmet-async';
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Abc as AbcIcon,
  List as ListIcon,
  PlaylistAdd as PlaylistAddIcon,
  CheckBox as CheckBoxIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
} from '@mui/icons-material';

import { FormTheme } from '@tes/ui/form';
import { QuestionCard } from '../QuestionCard';

const useStyles = makeStyles(({ spacing, breakpoints, typography }) => ({
  root: {
    marginBottom: spacing(4),
    maxWidth: 720,

    [breakpoints.down('md')]: {
      maxWidth: 632,
      paddingRight: spacing(6),
      paddingLeft: spacing(6),
    },

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
  hasData?: boolean;
}

const questionTypes = [
  {
    type: 'Free text',
    slug: 'text',
    icon: <AbcIcon />,
  },
  {
    type: 'Dropdown',
    slug: 'select',
    icon: <ListIcon />,
  },
  {
    type: 'Dropdown with other',
    slug: 'select_with_other',
    icon: <PlaylistAddIcon />,
  },
  {
    type: 'Checkboxes',
    slug: 'checkboxes',
    icon: <CheckBoxIcon />,
  },
  {
    type: 'Radio Choices',
    slug: 'radio',
    icon: <RadioButtonCheckedIcon />,
  },
];

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export function FullPageContent(props: IFullPageContent) {
  const classes = useStyles();
  const {
    title,
    description,
    formElement,
    saveTitle,
    onFormSubmit,
    hasFormErrors,
    hasData,
  } = props;
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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

        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
          {description}
        </Typography>

        <Typography variant="body2" sx={{ fontSize: '1rem', mt: 2 }}>
          For each question group, you can indicate whether it is required for
          all projects and if it should be repeated at every survey moment.
        </Typography>

        <Box mt={3}></Box>

        <form onSubmit={onFormSubmit}>
          {hasData && (
            <Box sx={{ my: 4 }} className={classes.buttonSingle}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={hasFormErrors}
              >
                {saveTitle}
              </Button>
            </Box>
          )}

          <FormTheme>{formElement}</FormTheme>

          <Box sx={{ mt: 4 }} className={classes.buttonSingle}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={hasFormErrors || !hasData}
            >
              {saveTitle}
            </Button>
          </Box>
        </form>

        <Drawer variant="permanent" anchor="right" open={open}>
          <DrawerHeader sx={{ backgroundColor: '#75a4a3' }}>
            <IconButton
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              sx={{ color: '#fff' }}
            >
              {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Box
            sx={{
              mt: 4,
              p: open ? 2 : 1,
              pt: 0,
              display: 'flex',
              flexFlow: 'column',
              width: '100%',
            }}
          >
            {open ? (
              <Typography
                variant="h6"
                sx={{
                  whiteSpace: open ? 'wrap' : 'no-wrap',
                  mb: 3,
                  overflow: open ? 'inherit' : 'hidden',
                  textOverflow: open ? 'inherit' : 'ellipsis',
                }}
              >
                Questions
              </Typography>
            ) : null}

            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              {questionTypes.map((questionType, index) => (
                <QuestionCard
                  key={`${index}_${questionType}`}
                  type={questionType.type}
                  slug={questionType.slug}
                  icon={questionType.icon}
                  drawerOpen={open}
                />
              ))}
            </Box>
          </Box>
        </Drawer>
      </Container>
    </>
  );
}
