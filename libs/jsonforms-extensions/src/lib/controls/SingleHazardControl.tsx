import React from 'react';
import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import { SingleHazardWidget } from '../widgets';

export const SingleHazardControl = (props: ControlProps & OwnPropsOfEnum) => {
  const { errors } = props;
  const isValid = errors.length === 0;

  return <SingleHazardWidget {...props} isValid={isValid} />;
};

export const SingleHazardControlTester: RankedTester = rankWith(
  10,
  uiTypeIs('SingleHazardControl'),
);

export const SingleHazardControlRenderer = withJsonFormsOneOfEnumProps(
  React.memo(SingleHazardControl),
  false,
);
