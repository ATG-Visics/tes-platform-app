import {
  ControlProps,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import { useContext, useMemo, useState } from 'react';
import {
  DynamicAPIContext,
  IInstrument,
  IInstrumentModel,
} from '@tes/utils-hooks';
import { ApiAutocompleteWidget } from './APIAutoComplete';

export const InstrumentsControl = (props: ControlProps & OwnPropsOfEnum) => {
  const { errors } = props;
  const isValid = errors.length === 0;
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);

  const context = useContext(DynamicAPIContext);

  const apiResponse =
    context?.useGetAllInstrumentsQuery &&
    context?.useGetAllInstrumentsQuery(
      {
        page: 0,
        search: inputValue,
        limit: 20,
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

      return apiResponse.data.results
        .map((item) => ({
          ...item,
          instrumentSet: item.instrumentSet.map((subItem: IInstrument) => ({
            ...subItem,
            parent: item,
          })),
        }))
        .reduce(
          (acc: Array<IInstrument & { parent: IInstrumentModel }>, item) => {
            return [...acc, ...item.instrumentSet];
          },
          [],
        )
        .map((item) => ({
          value: `${item.id} | ${item.parent.instrumentType}`,
          label: `${item.parent.title}, #${item.serialNumber}`,
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

export const InstrumentsControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('InstrumentsControl'),
);

export const InstrumentsControlRenderer =
  withJsonFormsOneOfEnumProps(InstrumentsControl);
