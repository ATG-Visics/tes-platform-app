import React from 'react';
import {
  ControlProps,
  isOneOfEnumControl,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import { AutocompleteWidget } from '../widgets/AutoCompleteWidget';

export const OneOfEnumControl = (props: ControlProps & OwnPropsOfEnum) => {
  const { errors } = props;
  const isValid = errors.length === 0;

  return <AutocompleteWidget {...props} isValid={isValid} />;
};

export const OneOfEnumControlTester: RankedTester = rankWith(
  10,
  isOneOfEnumControl,
);

export const OneOfEnumControlRenderer = withJsonFormsOneOfEnumProps(
  React.memo(OneOfEnumControl),
  false,
);
