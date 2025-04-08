import { PageNotFound } from '@tes/ui/core';
import { RECORD_STATUS, useRecord } from '@tes/utils-hooks';
import { useGetProjectByIdQuery } from '../../api';
import { useMemo } from 'react';
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import { ProjectInfoList } from '@tes/platform';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';

export function ProjectInfoPage() {
  const isClient = useSelector(selectIsClient);
  const { navigateToRoute } = useCustomNavigate();

  const {
    record: item,
    recordStatus,
    recordId,
  } = useRecord({
    useRecordQuery: useGetProjectByIdQuery,
  });

  const projectItem = useMemo(() => {
    if (!item) {
      return;
    }

    return {
      id: item.id,
      secondaryInfo1: item.addressLine1,
      secondaryInfo2: item.addressLine2,
      secondaryInfo3: `${item.postalCode} ${item.city}`,
      secondaryInfo4: `${item.state} ${item.country}`,
    };
  }, [item]);

  const clientInfo = useMemo(() => {
    if (!item) {
      return;
    }

    return {
      id: item.id,
      secondaryInfo1: item.contactPerson,
      secondaryInfo2: (
        <Link
          href={'mailto:' + item.email}
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
            {item.email}
          </Box>
        </Link>
      ),
      secondaryInfo3: (
        <Link
          href={'tel:' + item.phone}
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
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              lineHeight: 1.5,
            }}
          >
            {item.phone}
          </Box>
        </Link>
      ),
    };
  }, [item]);

  if (!item) {
    return <PageNotFound />;
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}
      {recordStatus === RECORD_STATUS.SUCCEEDED && (
        <>
          <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" mb={2}>
                {item.title}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: 'inline-flex', justifyContent: 'flex-end' }}
            >
              {!isClient && (
                <Button
                  sx={{ height: 'fit-content' }}
                  variant="contained"
                  onClick={() =>
                    navigateToRoute('projectUpdate', {
                      params: { id: recordId || '' },
                    })
                  }
                >
                  <EditIcon sx={{ mr: 1 }} />
                  Edit Project
                </Button>
              )}
            </Grid>
          </Grid>
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
                title="Contact information"
                item={clientInfo}
                showEditButton={false}
                emptyMessage="No Client found"
              />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
