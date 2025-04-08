import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// TODO save selection to localstorage

function getIdByValue(map: Map<string, string>, searchValue: string) {
  for (const [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }
  return '';
}

interface IProps {
  clientList?: Map<string, string>;
  onChangeSelection: (newSelection: string[]) => void;
}

export default function MultiSelect({ clientList, onChangeSelection }: IProps) {
  const clients =
    clientList &&
    Array.from(clientList.entries()).map(([id, name]) => ({
      id,
      name,
    }));

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;

    setPersonName(typeof value === 'string' ? value.split(',') : value);
    if (typeof value === 'string') {
      const id = clientList && getIdByValue(clientList, value);
      id && onChangeSelection([id]);
    } else {
      const selection = value.reduce((acc, name) => {
        if (clientList) {
          acc.push(getIdByValue(clientList, name));
        }
        return acc;
      }, [] as string[]);

      onChangeSelection(selection);
    }
  };

  return (
    <div>
      <FormControl sx={{ width: 420 }}>
        <InputLabel>Select Clients</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {clients?.map((client) => (
            <MenuItem key={client.id} value={client.name}>
              <Checkbox checked={personName.includes(client.name)} />
              <ListItemText primary={client.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
