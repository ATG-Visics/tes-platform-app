import { useCallback } from 'react';
import {
  ArrayLayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { HazardsLayout } from '../layout/HazardsLayout';
import { withJsonFormsArrayLayoutProps } from '@jsonforms/react';

export const HazardListControl = (props: ArrayLayoutProps) => {
  const addItemCb = useCallback(
    (p: string, value: unknown) => props.addItem(p, value),
    [props],
  );
  return <HazardsLayout {...props} addItem={addItemCb} />;
};

export const HazardListControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('HazardListControl'),
);

export const HazardListControlRenderer =
  withJsonFormsArrayLayoutProps(HazardListControl);
