import { Box, Button, Typography } from '@mui/material';
import { INoiseResult } from '../../api';
import * as colors from '@tes/ui/colors';
import { Edit as EditIcon } from '@mui/icons-material';
import { useCustomNavigate } from '@tes/router';
import { useParams, useSearchParams } from 'react-router-dom';

interface IProps {
  disable: boolean;
  item?: INoiseResult;
  isClient: boolean;
}

export function SampleNoiseResultDetail(props: IProps) {
  const { navigateToRoute } = useCustomNavigate();
  const { item, isClient, disable } = props;
  const {
    id = '',
    subjectType = '',
    subjectId = '',
    sampleId = '',
  } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();

  const selectedDate = searchParams.get('selectedDate') || '';

  if (!item) {
    return (
      <Box
        mb={2}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            color: colors.accent1['700'],
          }}
          variant={'subtitle1'}
        >
          Noise
        </Typography>

        {!isClient && (
          <Box>
            <Button
              disabled={disable}
              variant="contained"
              onClick={() =>
                navigateToRoute(`noiseResultCreate`, {
                  params: { subjectType, subjectId, sampleId },
                })
              }
              sx={{ mt: 2 }}
            >
              Add result
            </Button>
            {disable && (
              <Typography
                sx={{
                  fontStyle: 'italic',
                  fontSize: '12px',
                }}
                variant="body2"
              >
                Finish the sample first
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          top: '-50px',
          position: 'absolute',
          right: 2,
        }}
      >
        {!isClient && (
          <Button
            variant="contained"
            sx={{ ml: 'auto' }}
            onClick={() =>
              navigateToRoute(`noiseResultCreate`, {
                params: { id, subjectType, subjectId, sampleId },
                query: { selectedDate },
              })
            }
          >
            <EditIcon sx={{ mr: 1 }} />
            Edit result
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'column wrap',
          maxWidth: '75%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box sx={{ minWidth: '175px' }}>
            <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
              Occupational Exposure Limit (OEL):
            </Typography>
            <Typography variant={'body1'}>{item.oel}</Typography>
          </Box>
          <Box sx={{ minWidth: '175px' }}>
            <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
              Action level:
            </Typography>
            <Typography variant={'body1'}>{item.al}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box sx={{ minWidth: '175px' }}>
            <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
              ACGIH/Niosh (dBA):
            </Typography>
            <Typography variant={'body1'}>{item.acgihNoishDba}</Typography>
          </Box>
          <Box sx={{ minWidth: '175px' }}>
            <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
              ACGIH/Niosh (Dose%):
            </Typography>
            <Typography variant={'body1'}>{item.acgihNoishDose}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box sx={{ minWidth: '175px' }}>
            <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
              OSHA HCP (dBA):
            </Typography>
            <Typography variant={'body1'}>{item.oshaHcpDba}</Typography>
          </Box>
          <Box sx={{ minWidth: '175px' }}>
            <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
              OSHA HCP (Dose%):
            </Typography>
            <Typography variant={'body1'}>{item.oshaHcpDose}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box sx={{ minWidth: '175px' }}>
            <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
              OSHA PEL (dBA):
            </Typography>
            <Typography variant={'body1'}>{item.oshaPelDba}</Typography>
          </Box>
          <Box sx={{ minWidth: '175px' }}>
            <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
              OSHA PEL (Dose%):
            </Typography>
            <Typography variant={'body1'}>{item.oshaPelDose}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
              Las Max (dBa):
            </Typography>
            <Typography variant={'body1'}>{item.lasMaxDba}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
