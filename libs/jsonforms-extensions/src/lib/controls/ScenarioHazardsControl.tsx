import { useCallback } from 'react';
import {
  ArrayLayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';

import { withJsonFormsArrayLayoutProps } from '@jsonforms/react';
import { ScenarioHazardsLayout } from '../layout';

export const ScenarioHazardsControl = (props: ArrayLayoutProps) => {
  const addItemCb = useCallback(
    (p: string, value: unknown) => props.addItem(p, value),
    [props],
  );
  return <ScenarioHazardsLayout {...props} addItem={addItemCb} />;
};

export const ScenarioHazardsControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('ScenarioHazardsControl'),
);

export const ScenarioHazardsControlRenderer = withJsonFormsArrayLayoutProps(
  ScenarioHazardsControl,
);
