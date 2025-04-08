import { Box, Typography, List } from '@mui/material';

import { RECORD_STATUS, useRecord } from '@tes/utils-hooks';
import { useGetCalibrationDevicesByIdQuery } from '../../api';
import { Button, H1, PageNotFound } from '@tes/ui/core';
import { Edit as EditIcon } from '@mui/icons-material';
import { CalibrationDetailListItem } from '../../ui';
import { useCustomNavigate } from '@tes/router';

export function CalibrationDetailPage() {
  const { navigateToRoute } = useCustomNavigate();
  const { record: item, recordStatus } = useRecord({
    useRecordQuery: useGetCalibrationDevicesByIdQuery,
  });

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
                  navigateToRoute('calibrationUpdate', {
                    params: {
                      id: item.id,
                    },
                  })
                }
              >
                <EditIcon sx={{ marginRight: '8px' }} />
                Edit calibration device
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant={'h5'} sx={{ flexGrow: 1 }}>
                Serial numbers
              </Typography>
              <List>
                {item.calibrationInstrumentSet &&
                  item.calibrationInstrumentSet.map((item) => (
                    <CalibrationDetailListItem
                      key={item.serialNumber}
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
