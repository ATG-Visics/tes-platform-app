import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { Typography } from '@mui/material';
import { withJsonFormsControlProps } from '@jsonforms/react';

export const SelectedSamplingPlanControl = (
  props: ControlProps & OwnPropsOfEnum,
) => {
  const { data } = props;

  return (
    <>
      <Typography fontWeight="bold">Selected scenario</Typography>
      <Typography>{data?.title}</Typography>
    </>
  );
};

export const SelectedSamplingPlanControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('SelectedSamplingPlanControl'),
);

export const SelectedSamplingPlanControlRenderer = withJsonFormsControlProps(
  SelectedSamplingPlanControl,
);
