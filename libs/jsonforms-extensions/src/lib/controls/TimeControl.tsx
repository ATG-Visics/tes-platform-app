import debounce from 'lodash/debounce';
import {
  ControlProps,
  isTimeControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import { TextField } from '@mui/material';
import { useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import merge from 'lodash/merge';

export const getData = (
  data: string,
  saveFormat: string | undefined,
): Dayjs | null => {
  if (!data) {
    return null;
  }
  const dayjsData = dayjs(data, saveFormat);
  if (dayjsData.toString() === 'Invalid Date') {
    return null;
  }
  return dayjsData;
};

export function TimeControlBase(props: ControlProps) {
  const { label, uischema, path, handleChange, data, config } = props;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const saveFormat = appliedUiSchemaOptions.timeSaveFormat ?? 'HH:mm:ss';

  const debouncedUpdate = useCallback(
    debounce((newValue: string) => handleChange(path, newValue), 300),
    [handleChange, path],
  );

  const onChange: (time: Dayjs | null) => void = useCallback(
    (time: Dayjs | null) => {
      if (!time) {
        handleChange(path, undefined);
        return;
      }

      const result = dayjs(time).format(saveFormat);
      debouncedUpdate(result);
    },
    [saveFormat, debouncedUpdate, handleChange, path],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileTimePicker
        DialogProps={{
          sx: { '& .MuiPickersToolbar-penIconButton': { display: 'none' } },
        }}
        label=""
        value={getData(data, saveFormat)}
        onChange={(newValue) => {
          onChange(newValue);
        }}
        orientation="portrait"
        ampmInClock={true}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={data ? { shrink: true } : undefined}
            variant="standard"
            label={label}
          />
        )}
      />
    </LocalizationProvider>
  );
}

export const TimeControlTester: RankedTester = rankWith(10, isTimeControl);

export const TimeControlRenderer = withJsonFormsControlProps(TimeControlBase);
