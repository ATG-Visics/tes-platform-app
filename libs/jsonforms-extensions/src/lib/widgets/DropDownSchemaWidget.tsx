import { CellProps, WithClassname } from '@jsonforms/core';
import { useDebouncedChange } from '@jsonforms/material-renderers';
import merge from 'lodash/merge';

import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ChangeEvent } from 'react';

export function BasicSelectWithSchema(props: CellProps & WithClassname) {
  const { data, uischema, handleChange, config, path, schema } = props;

  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const [onChange] = useDebouncedChange(handleChange, '', data, path);

  return (
    <Select
      sx={{ minWidth: 120 }}
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      label={uischema.label}
      displayEmpty={true}
      autoFocus={appliedUiSchemaOptions.focus}
      onChange={(data: SelectChangeEvent<string | unknown>) => {
        onChange(data as unknown as ChangeEvent<HTMLSelectElement>);
      }}
    >
      {schema.enum &&
        schema.enum.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
    </Select>
  );
}
