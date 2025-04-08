import {
  ControlProps,
  isNumberControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { MuiInputNumber } from '@jsonforms/material-renderers';
import { BaseInputControl } from './BaseInputControl';

export const NumberControl = (props: ControlProps) => (
  <BaseInputControl {...props} input={MuiInputNumber} />
);

export const NumberControlTester: RankedTester = rankWith(2, isNumberControl);
export const NumberControlRenderer = withJsonFormsControlProps(NumberControl);
