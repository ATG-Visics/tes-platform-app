import {
  ControlProps,
  isStringControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { MuiInputText } from '@jsonforms/material-renderers';
import { BaseInputControl } from './BaseInputControl';

export const TextControl = (props: ControlProps) => (
  <BaseInputControl {...props} input={MuiInputText} />
);

export const TextControlTester: RankedTester = rankWith(2, isStringControl);
export const TextControlRenderer = withJsonFormsControlProps(TextControl);
