import {
  ControlProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { MaterialInputControl } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';

import { FileUploadWidget } from '../widgets';

export function FileUploadControlBase(props: ControlProps) {
  props = {
    ...props,
  };
  return <MaterialInputControl {...props} input={FileUploadWidget} />;
}

export const FileUploadControlTester: RankedTester = rankWith(
  30,
  uiTypeIs('FileUpload'),
);

export const FileUploadControl = withJsonFormsControlProps(
  FileUploadControlBase,
);
