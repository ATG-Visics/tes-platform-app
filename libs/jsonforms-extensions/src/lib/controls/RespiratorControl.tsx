import {
  ControlProps,
  DispatchPropsOfMultiEnumControl,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { useJsonForms, withJsonFormsMultiEnumProps } from '@jsonforms/react';
import { useMutuallyExclusiveOptions } from '../hooks';
import { BaseInputControl } from './BaseInputControl';
import { MuiMultiSelect } from '../ui';
import { Box } from '@mui/material';
import { MuiInputText } from '@jsonforms/material-renderers';

export const RespiratorControl = (
  props: ControlProps & OwnPropsOfEnum & DispatchPropsOfMultiEnumControl,
) => {
  const oneOfList = Array.isArray(props?.schema?.items)
    ? []
    : (props?.schema?.items?.enum as
        | Array<{ title: string; const: string }>
        | undefined) || [];

  const ctx = useJsonForms();

  const mutuallyExclusiveOptions =
    (props?.uischema?.options?.['mutuallyExclusiveOptions'] as string[]) || [];

  const { handleMutuallyExclusiveChange } = useMutuallyExclusiveOptions({
    oneOfList,
    mutuallyExclusiveOptions,
    data: props.data,
    handleChange: props.handleChange,
  });

  const showFilterFieldSearchTerm = 'air purifying respirator';

  const showFilterFieldOptionsList = oneOfList.filter(
    (item: { const: string; title: string }) =>
      item.title
        .toLowerCase()
        .includes(showFilterFieldSearchTerm.toLowerCase()),
  );

  const anySelectedAreShowFilterFields = props.data?.some(
    (selectedItem: string) =>
      showFilterFieldOptionsList?.some((item) => item.const === selectedItem),
  );

  const respiratorFiltersPath = 'respiratorFilters';

  let newPath;

  if (props.path.split('.').length > 1) {
    const pathList = props.path.split('.');
    pathList.pop();
    pathList.push(respiratorFiltersPath);
    newPath = pathList || props.path;
    newPath = newPath?.join('.');
  } else {
    newPath = `${respiratorFiltersPath}`;
  }

  return (
    <Box>
      <BaseInputControl
        {...props}
        input={MuiMultiSelect}
        handleChange={handleMutuallyExclusiveChange}
      />
      <Box
        sx={{
          display:
            !props.data || !anySelectedAreShowFilterFields ? 'none' : 'block',
        }}
      >
        <BaseInputControl
          {...props}
          id={`${props.id}.${newPath}`}
          label="Respirator filters"
          data={ctx?.core?.data[`${respiratorFiltersPath}`]}
          path={`${newPath}`}
          input={MuiInputText}
        />
      </Box>
    </Box>
  );
};

export const RespiratorControlTester: RankedTester = rankWith(
  2,
  uiTypeIs('RespiratorControl'),
);
export const RespiratorControlRenderer =
  withJsonFormsMultiEnumProps(RespiratorControl);
