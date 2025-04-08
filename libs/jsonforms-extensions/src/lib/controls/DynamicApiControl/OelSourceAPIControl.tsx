import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import { useMemo, useState } from 'react';
import { ApiAutocompleteWidget } from './APIAutoComplete';
import { useGetAllOelSourcesQuery } from '../../api';

export const OelSourceAPIControl = (props: ControlProps & OwnPropsOfEnum) => {
  const { errors } = props;
  const isValid = errors.length === 0;
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);

  const apiResponse = useGetAllOelSourcesQuery(
    {
      page: 0,
      search: inputValue,
      limit: 100,
    },
    { skip: inputValue === 'undefined' },
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

export const OelSourceAPIControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('OelSourceAPIControl'),
);

export const OelSourceAPIControlRenderer =
  withJsonFormsOneOfEnumProps(OelSourceAPIControl);
