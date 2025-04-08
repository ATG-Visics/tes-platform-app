import React from 'react';
import { Fab as MuiFab, FabProps as MuiFabProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

import { IconProps } from '../Icon';

interface IProps extends Omit<MuiFabProps, 'children'> {
  icon: React.ReactElement<IconProps>;
}

export type FabProps = IProps;

const useStyles = makeStyles(
  () => ({
    root: {},
    icon: {},
    label: {},
    primary: {},
    secondary: {},
  }),
  { name: 'IuiFab' },
);

export function Fab(props: IProps) {
  const { icon, ...classes } = useStyles();
  const { className, icon: iconNode, ...rest } = props;

  const clonedIcon = React.cloneElement(iconNode, {
    className: clsx(icon, iconNode.props.className),
  });

  return (
    <MuiFab
      className={clsx(className, classes.root)}
      classes={{
        // label: classes.label,
        primary: classes.primary,
        secondary: classes.secondary,
      }}
      {...rest}
    >
      {clonedIcon}
    </MuiFab>
  );
}

Fab.defaultProps = {
  color: 'primary',
} as IProps;
