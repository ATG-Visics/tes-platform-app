import {
  ControlProps,
  JsonSchema7,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  UISchemaElement,
  uiTypeIs,
} from '@jsonforms/core';
import {
  JsonFormsDispatch,
  withJsonFormsOneOfEnumProps,
} from '@jsonforms/react';
import { BaseInputControl } from './BaseInputControl';
import { MuiSelect } from '@jsonforms/material-renderers';
import { Box, Typography } from '@mui/material';
import { useContext, useMemo } from 'react';
import { WeldingContext } from '@tes/utils-hooks';
import { produce } from 'immer';

export const WeldingControlDevelop = (props: ControlProps & OwnPropsOfEnum) => {
  const oneOfList = props.schema.oneOf as Array<{
    title: string;
    const: string;
  }>;
  const otherList = oneOfList.filter(
    (item: { const: string; title: string }) => {
      return item.title.toLowerCase().includes('n/a');
    },
  );
  const { enabled, cells, renderers } = props;

  const foundAOtherItem = otherList.find((item) => item.const === props.data);

  const extraFieldList =
    props &&
    props.uischema &&
    props.uischema.options &&
    props?.uischema?.options['extraFields'].map(
      (item: { path: string; label: string; type: string }) => ({
        label: item.label,
        path: item.path,
        type: item.type,
      }),
    );

  const defaultSchema = useMemo(() => {
    if (!extraFieldList) {
      return;
    }

    const schemaFields = extraFieldList.reduce(
      (acc: object, item: { label: string; path: string; type: string }) => {
        return {
          ...acc,
          [item.path]: {
            type: item.type,
            title: item.label,
          },
        };
      },
      {},
    );

    const requiredFields = extraFieldList.map(
      (item: { label: string; path: string; type: string }) => item.path,
    );

    const preSchema: JsonSchema7 = {
      type: 'object',
      properties: {
        ...schemaFields,
      },
      required: [...requiredFields],
    };

    return preSchema;
  }, [extraFieldList]);

  const context = useContext(WeldingContext);

  if (!context) {
    return <Typography variant="body1">No welding results found.</Typography>;
  }

  const { data, isError, isSuccess } = context.useGetAllQuery({});

  const itemList =
    data && data.results.map((item) => ({ const: item.id, title: item.title }));

  const schema = produce(defaultSchema, (draftState) => {
    if (
      draftState &&
      draftState['properties'] &&
      draftState['properties']['metal']
    ) {
      draftState['properties']['metal']['oneOf'] = itemList || [];
    } else if (
      draftState &&
      draftState['properties'] &&
      draftState['properties']['personSubject'] &&
      draftState['properties']['personSubject']['properties'] &&
      draftState['properties']['personSubject']['properties']['metal']
    ) {
      draftState['properties']['personSubject']['properties']['metal'][
        'oneOf'
      ] = itemList || [];
    } else if (
      draftState &&
      draftState['properties'] &&
      draftState['properties']['areaSubject'] &&
      draftState['properties']['areaSubject']['properties'] &&
      draftState['properties']['areaSubject']['properties']['metal']
    ) {
      draftState['properties']['areaSubject']['properties']['metal']['oneOf'] =
        itemList || [];
    }
  });

  return (
    <Box>
      {isError && (
        <Typography variant="body1">
          An error occurred while fetching welding results.
        </Typography>
      )}
      {isSuccess && (
        <>
          <BaseInputControl {...props} errors={''} input={MuiSelect} />
          <Box
            sx={{ display: props.data && !foundAOtherItem ? 'block' : 'none' }}
          >
            {extraFieldList.map(
              ({ path }: { label: string; path: string; type: string }) => {
                return (
                  <JsonFormsDispatch
                    enabled={enabled}
                    schema={schema}
                    uischema={
                      {
                        type: 'Control',
                        scope: `#/properties/${path}`,
                      } as UISchemaElement
                    }
                    path=""
                    key={path}
                    renderers={renderers}
                    cells={cells}
                  />
                );
              },
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export const WeldingControlDevelopTester: RankedTester = rankWith(
  2,
  uiTypeIs('WeldingControlDevelop'),
);
export const WeldingControlDevelopRenderer = withJsonFormsOneOfEnumProps(
  WeldingControlDevelop,
);
