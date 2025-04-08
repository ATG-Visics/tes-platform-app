import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  ControlProps,
  EnumCellProps,
  EnumOption,
  isDescriptionHidden,
  WithClassname,
} from '@jsonforms/core';
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  FilterOptionsState,
  FormHelperText,
  Hidden,
  TextField,
} from '@mui/material';
import merge from 'lodash/merge';
import { useFocus } from '@jsonforms/material-renderers';
import { HazardsContext, mapListResult } from '@tes/utils-hooks';

interface HazardItem extends EnumOption {
  id: string;
  title: string;
  casNumber?: string;
}

export interface WithOptionLabel {
  getOptionLabel?(option: EnumOption): string;

  renderOption?(
    props: React.HTMLAttributes<HTMLLIElement>,
    option: HazardItem,
    state: AutocompleteRenderOptionState,
  ): ReactNode;

  filterOptions?(
    options: HazardItem[],
    state: FilterOptionsState<HazardItem>,
  ): HazardItem[];
}

const casNumberCheck = (value?: string) => {
  if (value === undefined || value === '0000-0000-0000') {
    return '';
  }
  return `- # ${value}`;
};

export function SingleHazardWidget(
  props: ControlProps & EnumCellProps & WithClassname & WithOptionLabel,
) {
  const {
    description,
    errors,
    visible,
    required,
    id,
    enabled,
    uischema,
    path,
    handleChange,
    config,
    data,
  } = props;

  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const [focused, onFocus, onBlur] = useFocus();
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const context = useContext(HazardsContext);

  const isValid = !hasUserInteracted || errors.length === 0;
  const blurHandler = useCallback(() => setHasUserInteracted(true), []);

  const queryResult =
    context && context.useGetAllQuery
      ? context.useGetAllQuery({
          hazardType: context.hazardType,
          searchTitle: searchValue !== '' ? searchValue : data,
        })
      : { data: undefined };

  const { itemList } = mapListResult(queryResult.data);

  const formattedHazardOptions = useMemo(
    () =>
      itemList.map((item) => ({
        ...item,
        label: `${item.title} ${casNumberCheck(item.casNumber)}`,
        value: item.id,
      })),
    [itemList],
  );

  const findOption =
    formattedHazardOptions.find((o) => o.value === data) ?? null;

  const handleSelectionChange = useCallback(
    (_event: React.SyntheticEvent, newValue: HazardItem | null) => {
      if (newValue) {
        handleChange(path, newValue.value);
      } else {
        handleChange(path, undefined);
      }
      setSearchValue('');
    },
    [handleChange, path],
  );

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription,
  );

  const firstFormHelperText = showDescription
    ? description
    : !isValid
    ? errors
    : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  return (
    <Hidden xsUp={!visible}>
      <Autocomplete
        disabled={!enabled}
        value={findOption}
        onChange={handleSelectionChange}
        onInputChange={(event, newInputValue) => {
          if (event) {
            setSearchValue(newInputValue);
          }
        }}
        autoHighlight
        autoSelect
        autoComplete
        fullWidth
        options={formattedHazardOptions}
        getOptionLabel={(option: HazardItem) =>
          option.label || option.title || ''
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search hazard"
            variant="standard"
            id={`${id}-input`}
            required={required && !appliedUiSchemaOptions.hideRequiredAsterisk}
            error={!isValid}
            fullWidth={!appliedUiSchemaOptions.trim}
            InputLabelProps={data ? { shrink: true } : undefined}
            onFocus={onFocus}
            onBlur={() => {
              onBlur();
              blurHandler();
            }}
            focused={focused}
          />
        )}
      />
      <FormHelperText sx={{ ml: 1 }} error={!isValid && !showDescription}>
        {firstFormHelperText}
      </FormHelperText>
      <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
    </Hidden>
  );
}
