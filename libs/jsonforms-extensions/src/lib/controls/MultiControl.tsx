import {
  ControlProps,
  isMultiLineControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { BaseInputControl } from './BaseInputControl';
import { MultiTextWidget } from '../widgets';

export const MultiTextControl = (props: ControlProps) => (
  <BaseInputControl {...props} input={MultiTextWidget} />
);

export const MultiTextControlTester: RankedTester = rankWith(
  10,
  isMultiLineControl,
);
export const MultiTextControlRenderer =
  withJsonFormsControlProps(MultiTextControl);
