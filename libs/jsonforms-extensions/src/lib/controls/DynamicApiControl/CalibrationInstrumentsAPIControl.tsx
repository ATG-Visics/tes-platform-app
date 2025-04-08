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
  ICalibration,
  ICalibrationModel,
} from '@tes/utils-hooks';
import { ApiAutocompleteWidget } from './APIAutoComplete';

export const CalibrationInstrumentsControl = (
  props: ControlProps & OwnPropsOfEnum,
) => {
  const { errors } = props;
  const isValid = errors.length === 0;
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);

  const context = useContext(DynamicAPIContext);

  const apiResponse =
    context?.useGetAllCalibrationInstrumentsQuery &&
    context?.useGetAllCalibrationInstrumentsQuery(
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
          calibrationInstrumentSet: item.calibrationInstrumentSet.map(
            (subitem) => ({
              ...subitem,
              parent: item,
            }),
          ),
        }))
        .reduce(
          (acc: Array<ICalibration & { parent: ICalibrationModel }>, item) => {
            return [...acc, ...item.calibrationInstrumentSet];
          },
          [],
        )
        .map((item) => ({
          value: item.id,
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

export const CalibrationInstrumentsControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('CalibrationInstrumentsControl'),
);

export const CalibrationInstrumentsControlRenderer =
  withJsonFormsOneOfEnumProps(CalibrationInstrumentsControl);
