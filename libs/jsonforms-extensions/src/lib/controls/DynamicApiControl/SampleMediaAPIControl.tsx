import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import { useContext, useMemo, useState } from 'react';
import { DynamicAPIContext } from '@tes/utils-hooks';
import { ApiAutocompleteWidget } from './APIAutoComplete';

export const SampleMediaControl = (props: ControlProps & OwnPropsOfEnum) => {
  const { errors } = props;
  const isValid = errors.length === 0;
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);

  const context = useContext(DynamicAPIContext);

  const apiResponse =
    context?.useGetAllMediaQuery &&
    context?.useGetAllMediaQuery(
      {
        searchTitle: inputValue,
      },
      { skip: !open },
    );

  const formattedResponse: Array<{ value: string; label: string }> | [] =
    useMemo(() => {
      if (!apiResponse) {
        return [];
      }

      if (!apiResponse.isSuccess) {
        return [];
      }

      if (!apiResponse.data) {
        return [];
      }

      return apiResponse.data.results.map((item) => ({
        value: item.id,
        label: item.title,
      }));
    }, [apiResponse]);

  return (
    <ApiAutocompleteWidget
      inputValue={inputValue}
      setInputValue={setInputValue}
      isValid={isValid}
      {...props}
      options={formattedResponse || []}
      open={open}
      setOpen={setOpen}
    />
  );
};

export const SampleMediaControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('SampleMediaControl'),
);

export const SampleMediaControlRenderer =
  withJsonFormsOneOfEnumProps(SampleMediaControl);
