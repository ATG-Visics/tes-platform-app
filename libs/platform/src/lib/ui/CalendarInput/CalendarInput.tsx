import { IconButton, Box, Typography } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

interface IProps {
  date: Dayjs | null;
  onClickOpen: () => void;
  onClickClosed: () => void;
  modelState: boolean;
  positionCalendar: (event: React.MouseEvent<HTMLElement>) => void;
}

export type CalendarInputProps = IProps;

export function CalendarInput(props: IProps) {
  const { date, onClickOpen, onClickClosed, modelState, positionCalendar } =
    props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography variant="subtitle1" color="primary">
        {dayjs(date).format('dddd DD MMMM YYYY')}
      </Typography>
      {modelState ? (
        <IconButton
          color="primary"
          onClick={(event) => {
            onClickClosed();
            positionCalendar(event);
          }}
        >
          <ExpandLessIcon />
        </IconButton>
      ) : (
        <IconButton
          color="primary"
          onClick={(event) => {
            onClickOpen();
            positionCalendar(event);
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      )}
    </Box>
  );
}
