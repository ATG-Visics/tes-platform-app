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
import { NumberInputWidget } from '../widgets/NumberInputWidget';

export const HearingProtectionControl = (
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

  const { handleMutuallyExclusiveChange, isMutuallyExclusive } =
    useMutuallyExclusiveOptions({
      oneOfList,
      mutuallyExclusiveOptions,
      data: props.data,
      handleChange: props.handleChange,
    });

  const hideNRRFieldOptionsList = oneOfList.filter(
    (item: { const: string; title: string }) => isMutuallyExclusive(item.const),
  );

  const allSelectedAreHideNRRFields = props.data?.every(
    (selectedItem: string) =>
      hideNRRFieldOptionsList.some((item) => item.const === selectedItem),
  );

  const noiseReductionRatingPath = 'noiseReductionRating';

  let newPath;

  if (props.path.split('.').length > 1) {
    const pathList = props.path.split('.');
    pathList.pop();
    pathList.push(noiseReductionRatingPath);
    newPath = pathList || props.path;
    newPath = newPath?.join('.');
  } else {
    newPath = `${noiseReductionRatingPath}`;
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
            !props.data || allSelectedAreHideNRRFields ? 'none' : 'block',
        }}
      >
        <BaseInputControl
          {...props}
          id={`${props.id}.${newPath}`}
          label="Noise reduction rating (dB)"
          data={ctx?.core?.data[`${noiseReductionRatingPath}`]}
          path={`${newPath}`}
          input={NumberInputWidget}
        />
      </Box>
    </Box>
  );
};

export const HearingProtectionControlTester: RankedTester = rankWith(
  2,
  uiTypeIs('HearingProtectionControl'),
);
export const HearingProtectionControlRenderer = withJsonFormsMultiEnumProps(
  HearingProtectionControl,
);
