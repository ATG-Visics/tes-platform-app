import {
  ControlProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { MaterialInputControl } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { RadioObject } from '../widgets';

export function RadioObjectControlBase(props: ControlProps) {
  props = {
    ...props,
  };

  return <MaterialInputControl {...props} input={RadioObject} />;
}

export const RadioObjectControlTester: RankedTester = rankWith(
  10,
  uiTypeIs('RadioObject'),
);

export const RadioObjectControl = withJsonFormsControlProps(
  RadioObjectControlBase,
);
