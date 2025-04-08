import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
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

export const HazardSelectControlWidget = (
  props: ControlProps & EnumCellProps & WithClassname & WithOptionLabel,
) => {
  const {
    description,
    errors,
    visible,
    required,
    className,
    id,
    enabled,
    uischema,
    path,
    handleChange,
    config,
    getOptionLabel,
    renderOption,
    filterOptions,
    data,
  } = props;

  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const [focused, onFocus, onBlur] = useFocus();
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValue, setSelectedValue] = useState<HazardItem | null>(null);

  const context = useContext(HazardsContext);

  const isValid = !hasUserInteracted || errors.length === 0;
  const blurHandler = useCallback(() => setHasUserInteracted(true), []);

  const queryResult =
    context && context.useGetAllQuery
      ? context.useGetAllQuery(
          {
            hazardType: context.hazardType,
            searchTitle: searchValue.includes('Select hazard')
              ? ''
              : searchValue,
          },
          { skip: !open },
        )
      : { data: undefined };

  const responseData = queryResult.data;

  const hazardList: HazardItem[] = useMemo(
    () =>
      (responseData
        ? mapListResult(responseData).itemList
        : []) as HazardItem[],
    [responseData],
  );

  const formattedHazardOptions = useMemo(
    () =>
      hazardList.map((item) => ({
        ...item,
        label: `${item.title} ${casNumberCheck(item.casNumber)}`,
        value: item.id,
      })),
    [hazardList],
  );

  useEffect(() => {
    if (data && data.id) {
      setSelectedValue({ ...data });
      setSearchValue(`${data.title} ${casNumberCheck(data.casNumber)}`);
      handleChange(path, data.id);
    }

    if (data && typeof data === 'string') {
      const matchingHazard = hazardList.find((item) => item.id === data);
      if (matchingHazard) {
        setSelectedValue(matchingHazard);
        setSearchValue(
          `${matchingHazard.title} ${casNumberCheck(matchingHazard.casNumber)}`,
        );
      }
    }
  }, [data, hazardList]);

  const handleSelectionChange = useCallback(
    (_event: React.SyntheticEvent, newValue: HazardItem | null) => {
      setSelectedValue(newValue);
      if (newValue) {
        handleChange(path, newValue.id);
        setSearchValue(
          `${newValue.title} ${casNumberCheck(newValue.casNumber)}`,
        );
      } else {
        handleChange(path, undefined);
        setSearchValue('');
      }
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
        className={className}
        id={id}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disabled={!enabled}
        value={selectedValue}
        onChange={handleSelectionChange}
        inputValue={searchValue}
        onInputChange={(_event, newInputValue) => {
          !selectedValue && setSearchValue(newInputValue);
        }}
        autoHighlight
        autoSelect
        autoComplete
        fullWidth
        options={formattedHazardOptions}
        getOptionLabel={
          getOptionLabel ||
          ((option: HazardItem) => option.label || option.title || '')
        }
        freeSolo={false}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search hazard"
            variant="standard"
            id={`${id}-input`}
            required={required && !appliedUiSchemaOptions.hideRequiredAsterisk}
            error={!isValid}
            fullWidth={!appliedUiSchemaOptions.trim}
            InputLabelProps={selectedValue ? { shrink: true } : undefined}
            onFocus={onFocus}
            onBlur={() => {
              onBlur();
              blurHandler();
            }}
            focused={focused}
          />
        )}
        renderOption={renderOption}
        filterOptions={filterOptions}
      />
      <FormHelperText error={!isValid && !showDescription}>
        {firstFormHelperText}
      </FormHelperText>
      <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
    </Hidden>
  );
};
