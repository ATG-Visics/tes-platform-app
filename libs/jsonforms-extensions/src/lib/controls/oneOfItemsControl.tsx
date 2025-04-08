import {
  ControlProps,
  DispatchPropsOfMultiEnumControl,
  OwnPropsOfEnum,
  Paths,
  RankedTester,
  rankWith,
  Resolve,
  uiTypeIs,
} from '@jsonforms/core';
import { MuiCheckbox } from '@jsonforms/material-renderers';

import { useJsonForms, withJsonFormsMultiEnumProps } from '@jsonforms/react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Hidden,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import merge from 'lodash/merge';

const OneOfItemsControl = ({
  schema,
  uischema: uiSchema,
  visible,
  errors,
  path,
  options,
  data,
  addItem,
  removeItem,
  handleChange: _handleChange,
  label,
  config,
  rootSchema,
}: ControlProps & OwnPropsOfEnum & DispatchPropsOfMultiEnumControl) => {
  const isValid = errors.length === 0;

  const { core } = useJsonForms();
  const rootData = Resolve.data(core?.data, path.split('.')[0]);

  const appliedUiSchemaOptions = merge({}, config, uiSchema.options);

  const secondFormHelperText = useMemo(() => {
    if (!appliedUiSchemaOptions.isQuestion) {
      return;
    }

    if (!rootData) {
      return;
    }

    if (rootData && rootData.answer) {
      return dayjs(rootData.updatedAt).format('MMM DD YYYY, hh:mm a');
    }

    return null;
  }, [appliedUiSchemaOptions.isQuestion, rootData]);

  return (
    <Hidden xlUp={!visible}>
      <Box position="relative">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              lineHeight: '1.4375em',
              letterSpacing: '0.00938em',
              fontWeight: 400,
              color: 'rgba(0 0 0 / 60%)',
            }}
          >
            {label}
          </Typography>
        </Box>
        <FormControl component="fieldset">
          <FormGroup row>
            {options?.map((option, index: number) => {
              const optionPath = Paths.compose(path, `${index}`);
              const checkboxValue = data?.includes(option.value)
                ? option.value
                : undefined;

              return (
                <FormControlLabel
                  id={option.value}
                  key={option.value}
                  control={
                    <MuiCheckbox
                      key={'checkbox-' + option.value}
                      isValid={isValid}
                      uischema={uiSchema}
                      path={optionPath}
                      handleChange={(_childPath, newValue) => {
                        newValue
                          ? addItem(path, option.value)
                          : removeItem && removeItem(path, option.value);
                      }}
                      data={checkboxValue}
                      errors={errors}
                      schema={schema}
                      visible={visible}
                      enabled
                      id={'option-' + option.value}
                      rootSchema={rootSchema}
                    />
                  }
                  label={option.label}
                />
              );
            })}
          </FormGroup>
          {!isValid && <FormHelperText error>{errors}</FormHelperText>}
          {secondFormHelperText && (
            <FormHelperText sx={{ ml: 0 }}>
              {secondFormHelperText}
            </FormHelperText>
          )}
        </FormControl>
      </Box>
    </Hidden>
  );
};

export const OneOfItemsControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('CheckBoxControl'),
);

export const OneOfItemsControlRenderer =
  withJsonFormsMultiEnumProps(OneOfItemsControl);
