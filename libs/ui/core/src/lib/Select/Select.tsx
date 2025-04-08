import {
  SelectProps as MuiSelectProps,
  Select as MuiSelect,
} from '@mui/material';

import { Icon } from '../Icon';

interface IProps extends MuiSelectProps {
  IconComponent?: typeof Icon;
}

export type SelectProps = IProps;

export function Select(props: IProps) {
  return <MuiSelect {...props} />;
}

Select.defaultProps = {
  variant: 'outlined',
  displayEmpty: true,
  IconComponent: (props) => (
    <Icon {...props} icon="chevron-down" prefix="fas" />
  ),
  fullWidth: true,
  MenuProps: { PaperProps: { square: true } },
} as IProps;
