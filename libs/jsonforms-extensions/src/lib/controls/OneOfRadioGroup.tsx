import {
  and,
  ControlProps,
  isOneOfEnumControl,
  optionIs,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import { OneOfRadioGroup } from './RadioGroup';

export const OneOfRadioGroupControl = (
  props: ControlProps & OwnPropsOfEnum,
) => {
  return <OneOfRadioGroup {...props} />;
};

export const OneOfRadioGroupControlTester: RankedTester = rankWith(
  30,
  and(isOneOfEnumControl, optionIs('format', 'radio')),
);

export const OneOfRadioGroupControlRenderer = withJsonFormsOneOfEnumProps(
  OneOfRadioGroupControl,
);
