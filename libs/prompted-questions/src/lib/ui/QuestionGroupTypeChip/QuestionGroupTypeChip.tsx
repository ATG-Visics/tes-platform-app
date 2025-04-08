import { Chip } from '@mui/material';

interface IProps {
  label: string;
  backgroundColor: string;
  color: string;
}

export type QuestionGroupTypeChipProps = IProps;

export function QuestionGroupTypeChip(props: IProps) {
  const { label, backgroundColor, color } = props;

  return (
    <Chip
      label={label}
      sx={{
        backgroundColor: backgroundColor,
        color: color,
      }}
    />
  );
}
