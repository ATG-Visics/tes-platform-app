import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  uiTypeIs,
  JsonSchema7,
} from '@jsonforms/core';
import { useJsonForms, withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import { BaseInputControl } from './BaseInputControl';
import { MuiInputText } from '@jsonforms/material-renderers';
import { Box } from '@mui/material';
import { MultiCheckboxControl } from '../controls';
import get from 'lodash.get';
import merge from 'lodash/merge';

export const DynamicMultiSelectControlWithOther = (
  props: ControlProps & OwnPropsOfEnum,
) => {
  const oneOf = get(props, [
    'schema',
    'items',
    'oneOf',
  ]) as JsonSchema7['oneOf'];

  const oneOfList = oneOf as Array<{
    title: string;
    const: string;
  }>;
  const ctx = useJsonForms();
  const otherList = oneOfList.filter((item: { const: string; title: string }) =>
    item.title.toLowerCase().startsWith('other'),
  );

  const optionList = Array<{ label: string; value: string }>();

  oneOfList.map((item) => {
    optionList.push({
      label: item.title,
      value: item.const,
    });
  });

  const foundAOtherItem = otherList.find((item) => item.const === props.data);
  const otherPath =
    props?.uischema?.options && props?.uischema?.options['otherApiName'];

  let newPath;

  if (props.path.split('.').length > 1) {
    const pathList = props.path.split('.');
    pathList.pop();
    pathList.push(otherPath);
    newPath = pathList || props.path;
    newPath = newPath?.join('.');
  } else {
    newPath = `${props.path}Other`;
  }

  const appliedUiSchemaOptions = merge(
    {},
    props?.config,
    props?.uischema.options,
  );

  return (
    <Box>
      <MultiCheckboxControl
        label={props?.label}
        uischema={props?.uischema}
        errors={''}
        options={optionList}
        data={undefined}
        rootSchema={props?.rootSchema}
        id={''}
        schema={props?.schema}
        enabled={true}
        visible={true}
        path={props?.path}
        handleChange={() =>
          props?.handleChange(props?.path, appliedUiSchemaOptions.value)
        }
        addItem={() => console.log('TODO fix the addItem')}
      />
      <Box sx={{ display: foundAOtherItem ? 'block' : 'none' }}>
        <BaseInputControl
          {...props}
          id={`${props.id}.${newPath}`}
          label={`${props.label} other`}
          data={ctx?.core?.data[`${otherPath}`]}
          path={`${newPath}`}
          input={MuiInputText}
        />
      </Box>
    </Box>
  );
};

export const DynamicMultiSelectControlWithOtherTester: RankedTester = rankWith(
  2,
  uiTypeIs('MultiSelectControlWithOther'),
);
export const DynamicMultiSelectControlWithOtherRenderer =
  withJsonFormsOneOfEnumProps(DynamicMultiSelectControlWithOther);
