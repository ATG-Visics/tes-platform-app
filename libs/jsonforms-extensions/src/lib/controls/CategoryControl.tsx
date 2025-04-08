import { useState } from 'react';
import { Box, Button, Hidden, Step, StepButton, Stepper } from '@mui/material';
import {
  and,
  Categorization,
  categorizationHasCategory,
  JsonSchema7,
  Layout,
  optionIs,
  RankedTester,
  rankWith,
  StatePropsOfLayout,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import {
  MaterialLayoutRenderer,
  MaterialLayoutRendererProps,
} from '@jsonforms/material-renderers';

export const materialCategorizationStepperTester: RankedTester = rankWith(
  10,
  and(
    uiTypeIs('CustomCategorization'),
    categorizationHasCategory,
    optionIs('variant', 'stepper'),
  ),
);

export interface MaterialCategorizationStepperLayoutRendererProps
  extends StatePropsOfLayout {
  data?: unknown;
  scope?: string;
}

interface Scoped {
  scope: string;
}

type scopedUIschema = Layout & Scoped;

export const MaterialCategorizationStepperLayoutRenderer = (
  props: MaterialCategorizationStepperLayoutRendererProps,
) => {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const handleStep = (step: number) => {
    setActiveCategory(step);
  };

  const { renderers, schema, uischema, visible, cells } = props;
  const categorization = uischema as Categorization;
  const categories = categorization.elements;
  const scopedUischema = uischema as scopedUIschema;
  const getScopeName = scopedUischema.scope.split('/');

  const childProps: MaterialLayoutRendererProps = {
    elements: categories[activeCategory].elements,
    schema:
      schema.properties &&
      (schema.properties[getScopeName[2]].items as JsonSchema7),
    path: `${getScopeName[2]}.${activeCategory}`,
    direction: 'column',
    visible,
    renderers,
    cells,
  };

  return (
    <Hidden xsUp={!visible}>
      <Stepper activeStep={activeCategory} nonLinear>
        {categories.map((e, idx: number) => (
          <Step key={e.label}>
            <StepButton onClick={() => handleStep(idx)}>{e.label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <MaterialLayoutRenderer {...childProps} />
      </Box>
      <Box
        sx={{
          textAlign: 'right',
          width: '100%',
          margin: '1em auto',
        }}
      >
        <Button
          sx={{ float: 'right' }}
          variant="contained"
          color="primary"
          disabled={activeCategory >= categories.length - 1}
          onClick={() => handleStep(activeCategory + 1)}
        >
          Next
        </Button>
        <Button
          sx={{ marginRight: '1em' }}
          color="secondary"
          variant="contained"
          disabled={activeCategory <= 0}
          onClick={() => handleStep(activeCategory - 1)}
        >
          Previous
        </Button>
      </Box>
    </Hidden>
  );
};

export const materialCategorizationStepperRenderer = withJsonFormsLayoutProps(
  MaterialCategorizationStepperLayoutRenderer,
);
