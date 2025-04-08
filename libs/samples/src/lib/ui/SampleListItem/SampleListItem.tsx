import {
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Button } from '@tes/ui/core';
import { ISampleListItem } from '../../api';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCustomNavigate } from '@tes/router';
import { useParams } from 'react-router-dom';

dayjs.extend(relativeTime);

interface IProps {
  item: ISampleListItem;
  subjectType: string;
  subjectId: string;
}

export function SampleListItem(props: IProps) {
  const { item, subjectType, subjectId } = props;
  const { navigateToRoute } = useCustomNavigate();
  const { id = '' } = useParams();

  const listOfConst = useMemo(
    () => item.hazards.reduce((acc, { title }) => acc + `${title}, `, ''),
    [item.hazards],
  );

  const lastCheck = useMemo(() => {
    if (item.checkins.length === 0) {
      return;
    }

    return item.checkins[0];
  }, [item.checkins]);

  const stateDate = dayjs
    .utc(`${item.surveyMoment.startDate} ${item.captureTimes[0].startTime}`)
    .local();

  const endTime = item.captureTimes[item.captureTimes.length - 1].endTime;

  return (
    <Card key={item.id} sx={{ mt: 3, width: '100%', boxShadow: 'none', pb: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mr: 2 }}>
            #{item.sampleId}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem' }} variant="body2">
            {item.instrument.model}
          </Typography>
        </Box>
        <Button
          onClick={() =>
            navigateToRoute('sampleDetail', {
              params: { id, subjectId, subjectType, sampleId: item.id },
            })
          }
        >
          Open sample
        </Button>
      </Box>
      <CardContent sx={{ py: 0, pb: 0 }}>
        {item.isOverloaded && (
          <Box sx={{ alignSelf: 'center' }}>
            <Chip
              variant="outlined"
              color="warning"
              label={'Has overloaded result'}
              size="small"
            />
          </Box>
        )}
        <List>
          <ListItem sx={{ p: 0 }}>
            <ListItemText
              sx={{ lineHeight: 1, my: '2px' }}
              secondary={'Sample type: ' + item.type}
            />
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemText
              sx={{ lineHeight: 1, my: '2px' }}
              secondary={'Hazards: ' + listOfConst}
            />
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemText
              sx={{ lineHeight: 1, my: '2px' }}
              secondary={`Start time: ${stateDate.format(
                'hh:mm a',
              )}. (${stateDate.fromNow()})`}
            />
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemText
              sx={{ lineHeight: 1, my: '2px' }}
              secondary={
                lastCheck
                  ? `Last check: ${dayjs(lastCheck.createdAt).format(
                      'D MMMM YYYY, hh:mm a',
                    )} (${dayjs(lastCheck.createdAt).fromNow()})`
                  : 'Last check: Has not been checked'
              }
            />
          </ListItem>
          {endTime && (
            <ListItem sx={{ p: 0 }}>
              <ListItemText
                sx={{ lineHeight: 1, my: '2px' }}
                secondary={'Sample has finished.'}
              />
            </ListItem>
          )}
          {endTime && item.hasResults && (
            <ListItem sx={{ p: 0 }}>
              <ListItemText
                sx={{ lineHeight: 1, my: '2px' }}
                secondary={'Sample has finished and has results.'}
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
