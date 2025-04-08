import {
  and,
  ControlProps,
  isEnumControl,
  optionIs,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsEnumProps } from '@jsonforms/react';
import { OneOfRadioGroup } from './RadioGroup';

export const RadioEnumControl = (props: ControlProps & OwnPropsOfEnum) => {
  return <OneOfRadioGroup {...props} />;
};

export const RadioEnumControlTester: RankedTester = rankWith(
  30,
  and(isEnumControl, optionIs('format', 'radio')),
);
export const RadioEnumControlRenderer =
  withJsonFormsEnumProps(RadioEnumControl);
