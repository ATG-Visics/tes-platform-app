import React, { useState } from 'react';
import { CellProps, WithClassname } from '@jsonforms/core';
import {
  IconButton,
  Input,
  InputAdornment,
  InputBaseComponentProps,
  InputProps,
  useTheme,
} from '@mui/material';
import merge from 'lodash/merge';
import Close from '@mui/icons-material/Close';
import {
  JsonFormsTheme,
  useDebouncedChange,
} from '@jsonforms/material-renderers';

interface MuiTextInputProps {
  muiInputProps?: InputProps['inputProps'];
  inputComponent?: InputProps['inputComponent'];
}

export const MultiTextWidget = React.memo(
  (props: CellProps & WithClassname & MuiTextInputProps) => {
    const [showAdornment, setShowAdornment] = useState(false);
    const {
      data,
      config,
      className,
      id,
      enabled,
      uischema,
      isValid,
      path,
      handleChange,
      schema,
      muiInputProps,
      inputComponent,
    } = props;
    const maxLength = schema.maxLength;
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    let inputProps: InputBaseComponentProps;
    if (appliedUiSchemaOptions.restrict) {
      inputProps = { maxLength: maxLength };
    } else {
      inputProps = {};
    }

    inputProps = merge(inputProps, muiInputProps);

    const [inputText, onChange, onClear] = useDebouncedChange(
      handleChange,
      '',
      data,
      path,
    );
    const onPointerEnter = () => setShowAdornment(true);
    const onPointerLeave = () => setShowAdornment(false);

    const theme: JsonFormsTheme = useTheme();

    return (
      <Input
        type="text"
        value={inputText}
        onChange={onChange}
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={appliedUiSchemaOptions.focus}
        multiline={appliedUiSchemaOptions.multi}
        rows={5}
        fullWidth={!appliedUiSchemaOptions.trim || maxLength === undefined}
        inputProps={inputProps}
        error={!isValid}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        sx={{
          pl: 2,
          backgroundColor: 'rgb(0 0 0 / 4%)',

          '& textarea': {
            mt: 2,
          },
        }}
        endAdornment={
          <InputAdornment
            position="end"
            style={{
              display:
                !showAdornment || !enabled || data === undefined
                  ? 'none'
                  : 'flex',
              position: 'absolute',
              right: 0,
            }}
          >
            <IconButton
              aria-label="Clear input field"
              onClick={onClear}
              size="large"
            >
              <Close
                sx={{
                  background:
                    theme.jsonforms?.input?.delete?.background ||
                    theme.palette.background.default,
                  borderRadius: '50%',
                }}
              />
            </IconButton>
          </InputAdornment>
        }
        inputComponent={inputComponent}
      />
    );
  },
);
