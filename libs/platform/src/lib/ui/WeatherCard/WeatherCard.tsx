import { Box, Card, Divider, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@tes/ui/core';
import dayjs from 'dayjs';
import * as colors from '@tes/ui/colors';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';
import { useParams } from 'react-router-dom';

interface IProps {
  title: string;
  emptyMessage: string;
  weatherConditions: Array<{
    id: string;
    title: string;
    measuredAt: string;
    temperatureFahrenheit: number;
    relativeHumidity: number;
    windSpeed: number;
    windDirection: string;
    windDirectionDisplay: string;
    pressure: string;
    precipitations: Array<string>;
  }>;
  onClickModal: (id: string | null) => void;
}

export type WeatherCardProps = IProps;

export function WeatherCard(props: IProps) {
  const isClient = useSelector(selectIsClient);
  const { navigateToRoute } = useCustomNavigate();
  const { id = '' } = useParams();
  const { title, emptyMessage, weatherConditions, onClickModal } = props;

  return (
    <Card sx={{ height: 'auto', width: '100%' }}>
      <Box
        component={'div'}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant={'h6'}
          sx={{ flexGrow: 1, color: colors.accent1['700'] }}
        >
          {title}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {weatherConditions.length > 0 ? (
            weatherConditions.map((item) => (
              <Box key={item.id}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="body2">{item.title}</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    {dayjs(item.measuredAt).format('hh:mm a')}{' '}
                  </Typography>

                  <Box sx={{ mr: 0, ml: 'auto' }}>
                    {!isClient && (
                      <IconButton onClick={() => onClickModal(item.id)}>
                        <EditIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'center',
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ color: colors.accent1['700'] }}
                  >
                    {item.temperatureFahrenheit} <span>&#8457;</span>
                  </Typography>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: colors.accent1['700'] }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption">
                      {`Humidity: ${item.relativeHumidity}`} %RH
                    </Typography>
                    <Typography variant="caption">
                      {`Wind: ${item.windSpeed} MPH, From ${item.windDirectionDisplay}`}
                    </Typography>
                    <Typography variant="caption">
                      {`Pressure: ${item.pressure}`} inHg
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2">{emptyMessage}</Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!isClient && (
            <Button
              onClick={() =>
                navigateToRoute(`weatherCreate`, { params: { id } })
              }
            >
              Add condition
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}
