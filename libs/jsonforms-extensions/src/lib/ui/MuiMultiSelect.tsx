import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { EnumCellProps, WithClassname } from '@jsonforms/core';
import merge from 'lodash/merge';
import { Input } from '@mui/material';
import { useEffect } from 'react';

export const MuiMultiSelect = React.memo(
  (props: EnumCellProps & WithClassname) => {
    const {
      data,
      className,
      id,
      enabled,
      uischema,
      path,
      handleChange,
      options,
      config,
    } = props;

    const appliedUiSchemaOptions = merge({}, config, uischema.options);

    useEffect(() => {
      handleChange(path, data);
    }, [data, handleChange, path]);

    return (
      <Select
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={appliedUiSchemaOptions.focus}
        value={data || []}
        onChange={(ev) => handleChange(path, ev.target.value)}
        fullWidth={true}
        variant={'standard'}
        multiple
        input={<Input />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {options?.map(
              (value: { value: { const: string; title: string } }) => {
                if (selected.includes(value.value.const))
                  return (
                    <Chip key={value.value.const} label={value.value.title} />
                  );
                return null;
              },
            )}
          </Box>
        )}
        sx={{ pt: 2.5 }}
      >
        {options &&
          options.map((option) => (
            <MenuItem key={option.value.const} value={option.value.const}>
              {option.value.title}
            </MenuItem>
          ))}
      </Select>
    );
  },
);
