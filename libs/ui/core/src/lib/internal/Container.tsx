import React from 'react';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

interface IProps {
  children: React.ReactNode;
  className?: string;
}

export type ContainerProps = IProps;

const useStyles = makeStyles(
  ({ spacing }) => ({
    root: {
      maxWidth: 980 + spacing(4),
      paddingLeft: spacing(4),
      paddingRight: spacing(4),
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    },
  }),
  { name: 'IuiContainer' },
);

export function Container({ children, className }: IProps) {
  const classes = useStyles();
  return <div className={clsx(classes.root, className)}>{children}</div>;
}
