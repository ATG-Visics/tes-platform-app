import { Box, Skeleton, Snackbar } from '@mui/material';
import { ClientHeader, FullWidthListCard } from '@tes/platform';

import { mapListResult, RECORD_STATUS, useRecord } from '@tes/utils-hooks';
import {
  useGetClientByIdQuery,
  useGetAllClientProjectsQuery,
  IClientProjectItem,
  useSendClientInviteMutation,
} from '../../api';
import { Button, H1, PageNotFound } from '@tes/ui/core';
import { Edit as EditIcon } from '@mui/icons-material';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { ClientDetailListItem } from '../../ui';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';

export enum PROJECT_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function ClientDetailPage() {
  const { navigateToRoute } = useCustomNavigate();

  const isClient = useSelector(selectIsClient);
  const [projectStatus, setProjectStatus] = useState<PROJECT_STATUS>(
    PROJECT_STATUS.IDLE,
  );
  const {
    record: item,
    recordStatus,
    recordId,
  } = useRecord({
    useRecordQuery: useGetClientByIdQuery,
  });

  const response = useGetAllClientProjectsQuery(
    { uuid: item ? item.id : '' },
    { skip: !item },
  );
  const { data, isSuccess, isError, isFetching, isLoading } = response;
  const { itemCount, itemList } = mapListResult<IClientProjectItem>(data);

  const [sendInvite, status] = useSendClientInviteMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClose = (_: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleSendInvite = useCallback(() => {
    if (!recordId) {
      return;
    }

    sendInvite(recordId);
  }, [recordId, sendInvite]);

  useEffect(() => {
    if (!status.isSuccess) {
      return;
    }

    setOpenSnackbar(true);
  }, [status.isSuccess]);

  useEffect(() => {
    if (projectStatus === PROJECT_STATUS.SUCCEEDED) {
      return;
    }

    if (!isSuccess) {
      return;
    }

    setProjectStatus(PROJECT_STATUS.SUCCEEDED);
  }, [projectStatus, isSuccess]);

  useEffect(() => {
    if (projectStatus === PROJECT_STATUS.FAILED) {
      return;
    }

    if (!isError) {
      return;
    }

    setProjectStatus(PROJECT_STATUS.FAILED);
  }, [projectStatus, isError]);

  useEffect(() => {
    if (projectStatus === PROJECT_STATUS.LOADING) {
      return;
    }

    if (!isLoading && !isFetching) {
      return;
    }

    setProjectStatus(PROJECT_STATUS.LOADING);
  }, [projectStatus, isLoading, isFetching]);

  if (!item) {
    return <PageNotFound />;
  }

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}

      {recordStatus === RECORD_STATUS.SUCCEEDED && (
        <>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <Box>
                <H1 variant="h5">{item.title}</H1>
              </Box>

              {!isClient && (
                <Button
                  variant="contained"
                  onClick={() => navigateToRoute('clientUpdate')}
                  sx={{
                    flexShrink: 0,
                    ml: 3,
                  }}
                >
                  <EditIcon sx={{ marginRight: '8px' }} />
                  Edit Client
                </Button>
              )}
            </Box>
          </Box>
          <Box sx={{ mb: 2, width: '100%', maxWidth: '720px', mx: 'auto' }}>
            <ClientHeader
              client={item.title}
              street1={item.addressLine1}
              street2={item.addressLine2}
              postalCode={item.postalCode}
              city={item.city}
              country={item.country}
              telephone={item.phone}
              email={item.email}
              contactPerson={item.contactPerson}
              handleSendInvite={handleSendInvite}
            />
          </Box>

          {projectStatus === PROJECT_STATUS.LOADING && (
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="rectangular" height={320} />
            </Box>
          )}

          {projectStatus === PROJECT_STATUS.SUCCEEDED && itemList && (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ width: '100%', maxWidth: '720px', mx: 'auto' }}>
                <FullWidthListCard
                  isClient={isClient}
                  title="Projects"
                  emptyMessage="No projects have been added yet."
                  buttonText="Start new project"
                  itemList={itemList}
                  onNewItemClick={() =>
                    navigateToRoute('projectCreateWithClientId', {
                      params: { clientId: recordId || '' },
                    })
                  }
                  onItemClick={(id) =>
                    navigateToRoute(`projectOverview`, {
                      params: { id: id.toString() },
                    })
                  }
                  itemCount={itemCount}
                  ListItemComponent={ClientDetailListItem}
                />
              </Box>
            </Box>
          )}

          {projectStatus === PROJECT_STATUS.FAILED && (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ width: '100%' }}>
                <FullWidthListCard
                  isClient={isClient}
                  title="No Project found"
                  emptyMessage="Try a refresh of the page or add a project"
                  buttonText="Start new project"
                  itemList={[]}
                  onNewItemClick={() => navigateToRoute('projectCreate')}
                  onItemClick={(id) =>
                    navigateToRoute(`projectOverview`, {
                      params: { id: id.toString() },
                    })
                  }
                  itemCount={0}
                  ListItemComponent={ClientDetailListItem}
                />
              </Box>
            </Box>
          )}

          {status.isSuccess && (
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              open={openSnackbar}
              autoHideDuration={5000}
              onClose={handleClose}
              message="The invite has been sent successfully!"
            />
          )}
        </>
      )}
    </>
  );
}
