import { Button, Card, Stack, Typography } from '@mui/material';
import * as colors from '@tes/ui/colors';
import { SamplingPlanChartPage } from '@tes/sampling-plan';
import { useCustomNavigate } from '@tes/router';
import { useParams } from 'react-router-dom';

export function ProjectSamplingPlanCard() {
  const { navigateToRoute } = useCustomNavigate();
  const { id = '' } = useParams();
  const onClickManageSampling = () => {
    navigateToRoute('samplingPlanList', {
      params: {
        id,
      },
    });
  };

  return (
    <Card sx={{ p: 2, height: 335 }}>
      <Stack direction="row">
        <Typography
          variant={'h6'}
          sx={{ flexGrow: 1, color: colors.accent1['700'] }}
        >
          Sampling Plan
        </Typography>
        <Button
          sx={{ mx: 'auto' }}
          onClick={onClickManageSampling}
          color="secondary"
          variant="contained"
        >
          Manage Sampling Plan
        </Button>
      </Stack>
      <Stack>
        <SamplingPlanChartPage />
      </Stack>
    </Card>
  );
}
