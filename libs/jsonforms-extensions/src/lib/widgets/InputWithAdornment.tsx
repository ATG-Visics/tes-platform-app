import { useMemo } from 'react';
import { CellProps, WithClassname } from '@jsonforms/core';
import { useDebouncedChange } from '@jsonforms/material-renderers';
import { Input, InputAdornment } from '@mui/material';
import merge from 'lodash/merge';
import { InputProps } from '@tes/ui/core';

const toNumber = (value: string) => (value === '' ? value : parseFloat(value));
const eventToValue = (ev: { target: { value: string } }) => ev.target.value;
const eventToNumberValueValue = (ev: { target: { value: string } }) =>
  toNumber(ev.target.value);

function useLabelFormatter({
  label,
  labelFormat,
}: {
  label: string;
  labelFormat?: 'html' | 'plaintext';
}) {
  return useMemo(() => {
    switch (labelFormat) {
      case 'html':
        // @FIXME super insecure. We need to parse and strip the html string.
        return <span dangerouslySetInnerHTML={{ __html: label }} />;
      case 'plaintext':
      default:
        return <span>{label}</span>;
    }
  }, [labelFormat, label]);
}
export function InputWithAdornment(props: CellProps & WithClassname) {
  const { data, uischema, schema, path, handleChange, config, id, enabled } =
    props;

  const inputProps: InputProps = {
    type: 'text',
  };

  if (schema.type === 'number' || schema.type === 'integer') {
    inputProps.type = 'number';
    inputProps.inputProps = {
      min: schema.minimum,
      max: schema.maximum,
    };
  }

  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const customEventFunc = schema?.type?.includes('string')
    ? eventToValue
    : eventToNumberValueValue;
  const [inputValue, onChange] = useDebouncedChange(
    handleChange,
    '',
    data,
    path,
    customEventFunc,
  );

  const endAdornment = (
    <InputAdornment position="end">
      {useLabelFormatter({
        label: appliedUiSchemaOptions.endAdornment || '',
        labelFormat: appliedUiSchemaOptions.endAdornmentFormat || 'plaintext',
      })}
    </InputAdornment>
  );

  return (
    <Input
      id={id}
      {...inputProps}
      autoFocus={appliedUiSchemaOptions.focus}
      value={inputValue}
      disabled={!enabled}
      onChange={onChange}
      endAdornment={endAdornment}
      readOnly={appliedUiSchemaOptions.readonly}
    />
  );
}
