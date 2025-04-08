import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends MuiButtonProps {}

export type ButtonProps = IProps;

export function Button(props: IProps) {
  return <MuiButton {...props} />;
}
