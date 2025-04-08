import {
  ArrayLayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { HazardsListSelectLayout } from '../layout/HazardsListSelectLayout';
import { withJsonFormsArrayLayoutProps } from '@jsonforms/react';

export const HazardListSelectControl = (props: ArrayLayoutProps) => {
  return <HazardsListSelectLayout {...props} />;
};

export const HazardListSelectControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('HazardListSelectControl'),
);

export const HazardListSelectControlRenderer = withJsonFormsArrayLayoutProps(
  HazardListSelectControl,
);
