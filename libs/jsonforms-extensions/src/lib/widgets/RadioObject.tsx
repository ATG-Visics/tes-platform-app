import { CellProps, JsonSchema7, WithClassname } from '@jsonforms/core';
import { useDebouncedChange } from '@jsonforms/material-renderers';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
} from '@mui/material';

interface ISchema extends JsonSchema7 {
  radioItems?: Array<{
    slug: string;
    title: string;
  }>;
}

export interface IProps extends CellProps, WithClassname {
  schema: ISchema;
}

export function RadioObject(props: IProps) {
  const { data, path, handleChange, schema } = props;

  const eventToValueFunc = (ev: {
    target: { value: never; labels: { innerText: never }[] };
  }) => ({
    slug: ev.target.value,
    title: ev.target.labels[0].innerText,
  });

  const [inputValue, onChange] = useDebouncedChange(
    handleChange,
    '',
    data,
    path,
    eventToValueFunc,
  );

  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">
        {schema.default}
      </FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        value={inputValue}
        name="radio-buttons-group"
        row
        onChange={(data) => onChange(data)}
      >
        {schema?.enum &&
          schema?.enum?.map((item) => (
            <FormControlLabel
              key={item.slug}
              checked={
                schema.const === item.title || inputValue.title === item.title
              }
              value={item.slug}
              control={<Radio />}
              label={item.title}
            />
          ))}
      </RadioGroup>
    </FormControl>
  );
}
