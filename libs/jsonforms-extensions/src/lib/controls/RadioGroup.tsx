import merge from 'lodash/merge';
import {
  ControlProps,
  isDescriptionHidden,
  OwnPropsOfEnum,
  Resolve,
  showAsRequired,
} from '@jsonforms/core';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Hidden,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useFocus } from '@jsonforms/material-renderers';
import { useCallback, useMemo, useState } from 'react';
import { useJsonForms } from '@jsonforms/react';
import dayjs from 'dayjs';

export const OneOfRadioGroup = (props: ControlProps & OwnPropsOfEnum) => {
  const [focused, onFocus, onBlur] = useFocus();
  const [hasUserBeenHereBefore, setHasUserBeenHereBefore] =
    useState<boolean>(false);
  const {
    config,
    id,
    label,
    required,
    description,
    errors,
    data,
    visible,
    options,
    handleChange,
    path,
    enabled,
  } = props;
  const { core } = useJsonForms();
  const rootData = Resolve.data(core?.data, path.split('.')[0]);
  const isValid = !hasUserBeenHereBefore || errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, props.uischema.options);
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription,
  );
  const onChange = (_: unknown, value: string) => handleChange(path, value);

  // Any Error oplossen en de has been here before toevoegen
  const blurHandler = useCallback(() => setHasUserBeenHereBefore(true), []);

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

  return (
    <Hidden xsUp={!visible}>
      <FormControl
        component={'fieldset' as 'div'}
        fullWidth={!appliedUiSchemaOptions.trim}
        onFocus={onFocus}
        onBlur={() => {
          onBlur();
          blurHandler();
        }}
      >
        <FormLabel
          htmlFor={id}
          error={!isValid}
          component={'legend' as 'label'}
          required={showAsRequired(
            required as boolean,
            appliedUiSchemaOptions.hideRequiredAsterisk,
          )}
        >
          {label}
        </FormLabel>

        <RadioGroup value={data ?? null} onChange={onChange} row={true}>
          {options?.map((option) => (
            <FormControlLabel
              value={option.value}
              key={option.label}
              control={<Radio checked={data === option.value} />}
              label={option.label}
              disabled={!enabled}
            />
          ))}
        </RadioGroup>
        <FormHelperText error={!isValid}>
          {!isValid ? errors : showDescription ? description : null}
        </FormHelperText>
        {secondFormHelperText && (
          <FormHelperText sx={{ ml: 0 }}>{secondFormHelperText}</FormHelperText>
        )}
      </FormControl>
    </Hidden>
  );
};
