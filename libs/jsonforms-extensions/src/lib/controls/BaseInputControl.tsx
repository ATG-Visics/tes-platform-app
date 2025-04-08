import {
  ControlProps,
  isDescriptionHidden,
  Resolve,
  showAsRequired,
} from '@jsonforms/core';

import { FormControl, FormHelperText, Hidden, InputLabel } from '@mui/material';
import merge from 'lodash/merge';
import { useFocus, WithInput } from '@jsonforms/material-renderers';
import { useCallback, useMemo, useState } from 'react';
import { useJsonForms } from '@jsonforms/react';
import dayjs from 'dayjs';

interface IProps extends ControlProps, WithInput {
  [key: string]: unknown;
}

export const BaseInputControl = (props: IProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const [hasUserBeenHereBefore, setHasUserBeenHereBefore] =
    useState<boolean>(false);
  const {
    id,
    description,
    errors,
    label,
    uischema,
    visible,
    required,
    config,
    input,
    path,
  } = props;
  const { core } = useJsonForms();
  const rootData = Resolve.data(core?.data, path.split('.')[0]);
  const isValid = !hasUserBeenHereBefore || errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

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
  const InnerComponent = input;

  const blurHandler = useCallback(() => setHasUserBeenHereBefore(true), []);

  return (
    <Hidden xsUp={!visible}>
      <FormControl
        fullWidth={!appliedUiSchemaOptions.trim}
        onFocus={onFocus}
        onBlur={() => {
          onBlur();
          blurHandler();
        }}
        id={id}
        variant={'standard'}
        sx={{ '& input': { pr: 2 } }}
      >
        <InputLabel
          htmlFor={id + '-input'}
          error={!isValid}
          required={showAsRequired(
            required as boolean,
            appliedUiSchemaOptions.hideRequiredAsterisk,
          )}
        >
          {label}
        </InputLabel>
        <InnerComponent
          {...props}
          id={id + '-input'}
          isValid={isValid}
          visible={visible}
        />
        <FormHelperText error={!isValid && !showDescription}>
          {firstFormHelperText}
        </FormHelperText>
        <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
      </FormControl>
    </Hidden>
  );
};
