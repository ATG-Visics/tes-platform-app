import { makeStyles } from '@mui/styles';

import { H1 } from '../Typography';

interface IProps {
  title: string;
}

export type DocumentTitleProps = IProps;

const useStyles = makeStyles(({ spacing }) => ({
  titleContainer: {
    flexGrow: 2,
    textAlign: 'center',
    paddingLeft: spacing(4),
    paddingRight: spacing(1),

    [`@media (min-width: ${1074 + spacing(1)}px)`]: {
      flexGrow: 'initial',
      textAlgin: 'left',
      paddingLeft: 0,
    },
  },
}));

export function PlatformTitle(props: IProps) {
  const { title } = props;
  const classes = useStyles();

  return (
    <div className={classes.titleContainer}>
      <H1 variant="body1" strong>
        {title}
      </H1>
    </div>
  );
}

PlatformTitle.defaultProps = {
  onEditClick: null,
};
