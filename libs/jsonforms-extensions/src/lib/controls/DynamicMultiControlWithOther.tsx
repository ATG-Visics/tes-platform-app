import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  Resolve,
  uiTypeIs,
} from '@jsonforms/core';
import { useJsonForms, withJsonFormsMultiEnumProps } from '@jsonforms/react';
import { BaseInputControl } from './BaseInputControl';
import { MuiInputText } from '@jsonforms/material-renderers';
import { Box } from '@mui/material';
import { MuiMultiSelect } from '../ui';
import { useMutuallyExclusiveOptions } from '../hooks';

export const DynamicMultiControlWithOther = (
  props: ControlProps & OwnPropsOfEnum,
) => {
  const oneOfList = Array.isArray(props?.schema?.items)
    ? []
    : (props?.schema?.items?.enum as
        | Array<{ title: string; const: string }>
        | undefined) || [];
  const ctx = useJsonForms();

  const mutuallyExclusiveOptions =
    (props?.uischema?.options?.['mutuallyExclusiveOptions'] as string[]) || [];

  const otherList = oneOfList.filter((item: { const: string; title: string }) =>
    item.title.toLowerCase().startsWith('other'),
  );

  const { handleMutuallyExclusiveChange } = useMutuallyExclusiveOptions({
    oneOfList,
    mutuallyExclusiveOptions,
    data: props.data,
    handleChange: props.handleChange,
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

  const dataWithOtherPath = Resolve.data(ctx?.core?.data, otherPath);
  const dataWithNewPath = Resolve.data(ctx?.core?.data, newPath);

  const usedData = dataWithOtherPath || dataWithNewPath;

  return (
    <Box>
      <BaseInputControl
        {...props}
        input={MuiMultiSelect}
        handleChange={handleMutuallyExclusiveChange}
      />
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

export const DynamicMultiControlWithOtherTester: RankedTester = rankWith(
  2,
  uiTypeIs('DynamicMultiControlWithOther'),
);
export const DynamicMultiControlWithOtherRenderer = withJsonFormsMultiEnumProps(
  DynamicMultiControlWithOther,
);
