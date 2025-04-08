import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import {
  ControlProps,
  EnumCellProps,
  EnumOption,
  isDescriptionHidden,
  Resolve,
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
import { MuiInputText, useFocus } from '@jsonforms/material-renderers';
import { BaseInputControl } from '../controls/BaseInputControl';
import dayjs from 'dayjs';
import { useJsonForms } from '@jsonforms/react';

export interface WithOptionLabel {
  getOptionLabel?(option: EnumOption): string;
  renderOption?(
    props: React.HTMLAttributes<HTMLLIElement>,
    option: EnumOption,
    state: AutocompleteRenderOptionState,
  ): ReactNode;
  filterOptions?(
    options: EnumOption[],
    state: FilterOptionsState<EnumOption>,
  ): EnumOption[];
}

export const AutocompleteWidget = (
  props: ControlProps & EnumCellProps & WithClassname & WithOptionLabel,
) => {
  const {
    description,
    errors,
    visible,
    required,
    label,
    data,
    className,
    id,
    enabled,
    uischema,
    path,
    handleChange,
    options,
    config,
    getOptionLabel,
    renderOption,
    filterOptions,
  } = props;
  const { core } = useJsonForms();
  const rootData = Resolve.data(core?.data, path?.split('.')[0]);
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const [inputValue, setInputValue] = React.useState(data ?? '');
  const [focused, onFocus, onBlur] = useFocus();
  const [hasUserBeenHereBefore, setHasUserBeenHereBefore] =
    useState<boolean>(false);

  const isValid = !hasUserBeenHereBefore || errors.length === 0;
  const blurHandler = useCallback(() => setHasUserBeenHereBefore(true), []);

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

  const secondFormHelperText = useMemo(() => {
    if (!appliedUiSchemaOptions.isQuestion) {
      return showDescription && !isValid ? errors : null;
    }

    if (!rootData) {
      return showDescription && !isValid ? errors : null;
    }

    if (rootData && rootData.answer) {
      return dayjs(rootData.updatedAt).format('MMM DD YYYY, hh:mm a');
    }

    return null;
  }, [
    appliedUiSchemaOptions.isQuestion,
    errors,
    isValid,
    rootData,
    showDescription,
  ]);

  if (!options) {
    return <BaseInputControl {...props} input={MuiInputText} />;
  }

  const findOption = options.find((o: EnumOption) => o.value === data) ?? null;

  return (
    <Hidden xsUp={!visible}>
      <Autocomplete
        className={className}
        id={id}
        disabled={!enabled}
        value={findOption}
        onChange={(_event, newValue: EnumOption | null) => {
          handleChange(path, newValue?.value);
        }}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        autoHighlight
        autoSelect
        autoComplete
        fullWidth
        options={options}
        getOptionLabel={getOptionLabel || ((option) => option?.label)}
        freeSolo={false}
        renderInput={(params) => {
          return (
            <TextField
              label={label}
              variant={'standard'}
              type="text"
              inputRef={params.InputProps.ref}
              autoFocus={appliedUiSchemaOptions.focus}
              {...params}
              id={id + '-input'}
              required={
                required && !appliedUiSchemaOptions.hideRequiredAsterisk
              }
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
          );
        }}
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
