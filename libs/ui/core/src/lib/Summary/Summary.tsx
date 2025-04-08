import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  extraClasses?: string;
}

export type SummaryProps = IProps;

const useStyles = makeStyles(
  ({ spacing, breakpoints }) => ({
    root: {
      display: 'flex',
      gap: spacing(1),
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      flex: 1,

      [breakpoints.up('sm')]: {
        gap: spacing(2),
      },
    },
  }),
  { name: 'IuiSummary' },
);

// @TODO evaluate naming. Summary is too generic. Summary of what? DocumentSummary?
export function Summary(props: IProps) {
  const { children, extraClasses } = props;
  const classes = useStyles();

  return <dl className={`${classes.root} ${extraClasses}`}>{children}</dl>;
}
