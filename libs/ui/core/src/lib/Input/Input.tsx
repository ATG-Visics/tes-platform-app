import { Input as MUIInput, InputProps as MUIInputProps } from '@mui/material';

export type InputProps = MUIInputProps;

export function Input(props: InputProps) {
  return <MUIInput disableUnderline {...props} />;
}

export default Input;
