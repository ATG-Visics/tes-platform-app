import React from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  CalendarToday as CalenderTodayIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { CalendarInput } from '../CalendarInput';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface IProps {
  startDate: Date;
  value: Dayjs;
  setValue: (newDate: Dayjs) => void;
}

export type SurveyDashboardCalendarProps = IProps;

export function SurveyDashboardCalendar(props: IProps) {
  const { startDate, value, setValue } = props;
  const [modelState, setModelState] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const positionCalendar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        maxHeight: '40px',
      }}
    >
      <Stack direction="row" spacing={1}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(newValue) => {
              setValue(dayjs(newValue));
              setModelState(false);
            }}
            minDate={dayjs(startDate)}
            value={value}
            open={modelState}
            PopperProps={{ anchorEl: anchorEl, placement: 'bottom' }}
            renderInput={() => (
              <CalendarInput
                date={value}
                onClickOpen={() => setModelState(true)}
                onClickClosed={() => setModelState(false)}
                modelState={modelState}
                positionCalendar={(event) => positionCalendar(event)}
              />
            )}
          />
        </LocalizationProvider>
        <IconButton
          aria-label="Today"
          onClick={() => {
            if (value !== null) {
              setValue(dayjs(new Date(Date.now())));
            }
          }}
        >
          <CalenderTodayIcon />
        </IconButton>
        <IconButton
          aria-label="Yesterday"
          onClick={() => {
            setValue(dayjs(value.subtract(1, 'day')));
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          aria-label="Tomorrow"
          onClick={() => {
            setValue(dayjs(value.add(1, 'day')));
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
