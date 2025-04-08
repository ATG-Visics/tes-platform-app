import {
  ControlProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { InputWithAdornment } from '../widgets';
import { BaseInputControl } from './BaseInputControl';

export function InputWithAdornmentControlBase(props: ControlProps) {
  return <BaseInputControl {...props} input={InputWithAdornment} />;
}

export const InputWithAdornmentControlTester: RankedTester = rankWith(
  10,
  uiTypeIs('InputAdornment'),
);

export const InputWithAdornmentControl = withJsonFormsControlProps(
  InputWithAdornmentControlBase,
);
