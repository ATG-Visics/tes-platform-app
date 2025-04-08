import {
  ControlProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { MaterialInputControl } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {CanvasWidget} from '../widgets';

export function CanvasControlBase(props: ControlProps) {
  return <MaterialInputControl {...props} input={CanvasWidget} />;
}

export const CanvasControlTester: RankedTester = rankWith(
  10,
  uiTypeIs('CanvasControl'),
);

export const CanvasControlRenderer = withJsonFormsControlProps(
  CanvasControlBase,
);
