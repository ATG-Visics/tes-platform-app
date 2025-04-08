import {
  ControlProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Button } from '@mui/material';
import merge from 'lodash/merge';

export function ButtonControl(props: ControlProps) {
  const { uischema, path, handleChange, config, label, data, enabled } = props;

  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <Button
      sx={{ mt: 2 }}
      disabled={!enabled}
      onClick={() => handleChange(path, appliedUiSchemaOptions.value)}
      variant={data === appliedUiSchemaOptions.value ? 'contained' : 'outlined'}
    >
      {label}
    </Button>
  );
}

export const ButtonControlTester: RankedTester = rankWith(
  10,
  uiTypeIs('ButtonControl'),
);

export const ButtonControlRenderer = withJsonFormsControlProps(ButtonControl);
