import React from 'react';
import { CellProps, WithClassname } from '@jsonforms/core';
import { Input } from '@mui/material';
import merge from 'lodash/merge';
import { useDebouncedChange } from '@jsonforms/material-renderers';

const toNumber = (value: string) =>
  value === '' ? undefined : parseFloat(value);
const eventToValue = (ev: { target: { value: string } }) =>
  toNumber(ev.target.value);
export const NumberInputWidget = React.memo(
  (props: CellProps & WithClassname) => {
    const {
      data,
      className,
      id,
      enabled,
      uischema,
      path,
      handleChange,
      config,
    } = props;
    const inputProps = { step: '0.1' };

    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    const [inputValue, onChange] = useDebouncedChange(
      handleChange,
      undefined,
      data,
      path,
      eventToValue,
    );

    return (
      <Input
        type="number"
        value={inputValue}
        onChange={onChange}
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={appliedUiSchemaOptions.focus}
        inputProps={inputProps}
        fullWidth={true}
      />
    );
  },
);
