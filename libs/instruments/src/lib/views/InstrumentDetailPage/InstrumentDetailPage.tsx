import { Box, List, Typography } from '@mui/material';

import { RECORD_STATUS, useRecord } from '@tes/utils-hooks';
import { useGetInstrumentByIdQuery } from '../../api';
import { Button, H1, PageNotFound } from '@tes/ui/core';
import { Edit as EditIcon } from '@mui/icons-material';
import { InstrumentDetailListItem } from '../../ui';
import { CrudLoading } from '@tes/crud';
import { useCustomNavigate } from '@tes/router';

export function InstrumentDetailPage() {
  const { navigateToRoute } = useCustomNavigate();
  const { record: item, recordStatus } = useRecord({
    useRecordQuery: useGetInstrumentByIdQuery,
  });

  // TODO generic solution for record status
  if (!item && recordStatus === RECORD_STATUS.LOADING) {
    return <CrudLoading />;
  }

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
                <H1 variant="h4">{item.title}</H1>
              </Box>

              <Button
                variant="contained"
                onClick={() =>
                  navigateToRoute('instrumentUpdate', {
                    params: { id: item.id },
                  })
                }
              >
                <EditIcon sx={{ marginRight: '8px' }} />
                Edit Instrument
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant={'h5'} sx={{ flexGrow: 1 }}>
                Serial numbers
              </Typography>
              <List>
                {item.instrumentSet &&
                  item.instrumentSet.map((item) => (
                    <InstrumentDetailListItem
                      key={item.id}
                      title={`Serial number: '${item.serialNumber}'`}
                    />
                  ))}
              </List>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
