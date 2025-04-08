import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { RECORD_STATUS, useRecord } from '@tes/utils-hooks';
import { useGetProjectByIdQuery } from '../../api';
import { PageNotFound } from '@tes/ui/core';
import { useOutletContext } from 'react-router-dom';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ProjectInfoList } from '@tes/platform';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { ProjectLocationCreatePage } from '@tes/project-location';
import { useCustomNavigate } from '@tes/router';

export function ProjectDetailPage() {
  const { navigateToRoute } = useCustomNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useMemo(() => setHasBackButton(true), [setHasBackButton]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const {
    record: item,
    recordStatus,
    refetch,
  } = useRecord({
    useRecordQuery: useGetProjectByIdQuery,
    refetchOnMount: true,
  });

  const projectItem = useMemo(() => {
    if (!item) {
      return;
    }

    return {
      id: item.id,
      title: 'Project information',
      secondaryInfo1: `IH Jobnumber:  ${item.jobNumber}`,
    };
  }, [item]);

  const clientInfo = useMemo(() => {
    if (!item) {
      return;
    }

    return {
      id: item.id,
      title: 'Contact information',
      secondaryInfo1: item.client.contactPerson,
      secondaryInfo2: (
        <Link
          href={'mailto:' + item.client.email}
          sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            py: 1,
            width: 'fit-content',
            '&:hover, &:focus': {
              textDecoration: 'underline',
            },
          }}
        >
          <EmailIcon sx={{ fontSize: '1rem' }} />
          <Box
            component={'span'}
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              lineHeight: 1.5,
            }}
          >
            {item.client.email}
          </Box>
        </Link>
      ),
      secondaryInfo3: (
        <Link
          href={'tel:' + item.client.phone}
          sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            py: 1,
            width: 'fit-content',
            '&:hover, &:focus': {
              textDecoration: 'underline',
            },
          }}
        >
          <PhoneIcon sx={{ fontSize: '1rem' }} />
          <Box
            component={'span'}
            sx={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              lineHeight: 1.5,
            }}
          >
            {item.client.phone}
          </Box>
        </Link>
      ),
    };
  }, [item]);

  if (!item) {
    return <PageNotFound />;
  }

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}

      {recordStatus === RECORD_STATUS.SUCCEEDED && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { sx: 'flex-start', sm: 'center' },
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ mb: { xs: 2, sm: 0 } }}>
                {item.title} for {item.client.title}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() =>
                navigateToRoute('projectUpdate', { params: { id: item.id } })
              }
            >
              <EditIcon sx={{ marginRight: '8px' }} />
              Edit project
            </Button>
          </Box>

          <Typography variant="body2" sx={{ maxWidth: '720px' }}>
            Welcome to the project page. Please start by adding Project
            Locations where the surveys will take place. Once Project Locations
            have been added, you can start taking surveys by opening the Project
            Location.
          </Typography>

          <Typography variant="body2" sx={{ maxWidth: '720px' }}>
            {item.description}
          </Typography>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <ProjectInfoList
                title={item.title}
                item={projectItem}
                showEditButton={false}
                emptyMessage="No Project found"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProjectInfoList
                title={item.client.title}
                item={clientInfo}
                showEditButton={true}
                editButtonText="Edit client"
                onClickEdit={() =>
                  navigateToRoute(`clientUpdate`, {
                    params: { id: item.client.id },
                  })
                }
                emptyMessage="No Client found"
              />
            </Grid>
          </Grid>

          <ProjectLocationCreatePage
            handleClose={handleClose}
            open={isOpen}
            refetch={refetch}
            projectRecord={item}
          />
        </>
      )}
    </>
  );
}
