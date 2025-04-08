import React from 'react';
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';

interface IProps {
  fullWidth?: boolean;
  placeholder?: string;
  searchValue?: string;
  onSearchChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
}

const useStyles = makeStyles(({ spacing }) => ({
  field: {
    backgroundColor: '#F5F5F5',
  },
  input: {
    padding: spacing(1),
    '&::placeholder': {
      color: '#9e9e9e',
      opacity: 1,
    },
  },
  icon: {
    color: '#616161',
    fontSize: 16,
  },
}));

export type SearchFieldProps = IProps;

export function SearchField(props: IProps) {
  const classes = useStyles();
  const { fullWidth, placeholder, searchValue, onSearchChange } = props;

  return (
    <FormControl
      sx={{ minWidth: '32ch' }}
      variant="outlined"
      fullWidth={fullWidth}
    >
      <OutlinedInput
        classes={{ root: classes.field, input: classes.input }}
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={onSearchChange}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

SearchField.defaultProps = {
  fullWidth: null,
  placeholder: '',
  searchValue: '',
};
