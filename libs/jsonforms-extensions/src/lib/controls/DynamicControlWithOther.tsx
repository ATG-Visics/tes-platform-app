import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  Resolve,
  uiTypeIs,
} from '@jsonforms/core';
import { useJsonForms, withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import { BaseInputControl } from './BaseInputControl';
import { MuiInputText, MuiSelect } from '@jsonforms/material-renderers';
import { Box } from '@mui/material';

export const DynamicControlWithOther = (
  props: ControlProps & OwnPropsOfEnum,
) => {
  const oneOfList = props.schema.oneOf as Array<{
    title: string;
    const: string;
  }>;
  const ctx = useJsonForms();
  const otherList = oneOfList.filter((item: { const: string; title: string }) =>
    item.title.toLowerCase().startsWith('other'),
  );

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

  const dataWithOtherPath = Resolve.data(ctx?.core?.data, otherPath);
  const dataWithNewPath = Resolve.data(ctx?.core?.data, newPath);

  const usedData = dataWithOtherPath || dataWithNewPath;

  return (
    <Box>
      <BaseInputControl {...props} input={MuiSelect} />
      <Box sx={{ display: foundAOtherItem ? 'block' : 'none' }}>
        <BaseInputControl
          {...props}
          id={`${props.id}.${newPath}`}
          label={`${props.label} other`}
          data={usedData}
          path={`${newPath}`}
          input={MuiInputText}
        />
      </Box>
    </Box>
  );
};

export const DynamicControlWithOtherTester: RankedTester = rankWith(
  2,
  uiTypeIs('ControlWithOther'),
);
export const DynamicControlWithOtherRenderer = withJsonFormsOneOfEnumProps(
  DynamicControlWithOther,
);
