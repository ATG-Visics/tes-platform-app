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

export const DynamicApiControl = (props: ControlProps & OwnPropsOfEnum) => {
  const { errors } = props;
  const isValid = errors.length === 0;
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);

  const context = useContext(DynamicAPIContext);

  const apiResponse =
    context?.useGetAllQuery &&
    context?.useGetAllQuery(
      {
        searchTitle: inputValue,
      },
      { skip: !open },
    );

  const formattedResponse = useMemo(() => {
    if (!apiResponse) {
      return;
    }

    if (!apiResponse.data) {
      return;
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

export const DynamicApiControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('SEGApiControl'),
);

export const DynamicApiControlRenderer =
  withJsonFormsOneOfEnumProps(DynamicApiControl);
