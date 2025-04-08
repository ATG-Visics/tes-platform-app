import React from 'react';
import { makeStyles } from '@mui/styles';

import { Text } from '../Typography';

interface IProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export type FilterSectionProps = IProps;

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {},
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),

    [breakpoints.up('lg')]: {
      gap: spacing(4),
    },
  },
  title: {
    padding: spacing(0, 3),
    '& + *': {
      marginTop: spacing(3),
    },
  },
}));

export function FilterSection(props: IProps) {
  const { children, header } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {header ? (
        typeof header === 'string' ? (
          <Text
            className={classes.title}
            gutterBottom
            variant="subtitle1"
            strong
          >
            {header}
          </Text>
        ) : (
          header
        )
      ) : null}

      <div className={classes.body}>{children}</div>
    </div>
  );
}
