import { Checkbox, FormControlLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface IProps {
  filterId: string | number;
  filterTitle: string;
  isSelected: boolean;
  onToggleSelect: (id: string | number) => void;
}

export type FilterItemProps = IProps;

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '100%',
  },
  label: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

export function FilterItem(props: IProps) {
  const classes = useStyles();
  const { filterId, filterTitle, isSelected, onToggleSelect } = props;

  return (
    <FormControlLabel
      classes={{ root: classes.root, label: classes.label }}
      control={<Checkbox name={`${filterId}`} />}
      checked={isSelected}
      label={filterTitle}
      title={filterTitle}
      onChange={() => onToggleSelect(filterId)}
    />
  );
}
