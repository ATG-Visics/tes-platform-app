import React, {
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useCallback,
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
import { MuiInputText, useFocus } from '@jsonforms/material-renderers';
import { BaseInputControl } from '../BaseInputControl';

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

interface IApiProps {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ApiAutocompleteWidget = memo(
  (
    props: ControlProps &
      EnumCellProps &
      WithClassname &
      WithOptionLabel &
      IApiProps,
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
      renderOption,
      filterOptions,
      inputValue,
      setInputValue,
      open,
      setOpen,
    } = props;
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    const [focused, onFocus, onBlur] = useFocus();
    const [hasUserBeenHereBefore, setHasUserBeenHereBefore] =
      useState<boolean>(false);

    const isValid = !hasUserBeenHereBefore || errors.length === 0;
    const blurHandler = useCallback(() => setHasUserBeenHereBefore(true), []);

    const onChangeData = useCallback(
      (newInputValue) => {
        if (!newInputValue) {
          handleChange(path, undefined);
          return;
        }
        handleChange(path, {
          id: newInputValue.value,
          title: newInputValue.label,
        });
      },
      [handleChange, path],
    );

    if (!options) {
      return <BaseInputControl {...props} input={MuiInputText} />;
    }

    const findOption =
      !open && data ? { value: data.id, label: data.title } : null;

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
          disabled={!enabled}
          value={findOption}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onChange={(_event, newValue: EnumOption | null) => {
            onChangeData(newValue);
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
          getOptionLabel={(option) =>
            option.label ? option?.label : data.title
          }
          freeSolo={false}
          renderInput={(params) => {
            return (
              <TextField
                autoComplete="off"
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
  },
);
