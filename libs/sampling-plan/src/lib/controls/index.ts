import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';

import {
  SamplingPlanSelectControlRenderer,
  SamplingPlanSelectControlTester,
  SelectedSamplingPlanControlRenderer,
  SelectedSamplingPlanControlTester,
  SelectJobTitleControlRenderer,
  SelectJobTitleControlTester,
} from '.';

export * from './SamplingPlanSelectControl';
export * from './SelectedSamplingPlanControl';
export * from './SelectJobTitleControl';

export const samplingPlanRenderers: JsonFormsRendererRegistryEntry[] = [
  {
    tester: SamplingPlanSelectControlTester,
    renderer: SamplingPlanSelectControlRenderer,
  },
  {
    tester: SelectedSamplingPlanControlTester,
    renderer: SelectedSamplingPlanControlRenderer,
  },
  {
    tester: SelectJobTitleControlTester,
    renderer: SelectJobTitleControlRenderer,
  },
];
