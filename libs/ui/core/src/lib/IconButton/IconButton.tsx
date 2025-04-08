import React from 'react';
import { Button, ButtonProps as MuiButtonProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

import { IconProps } from '../Icon';

interface IProps extends MuiButtonProps {
  icon: React.ReactElement<IconProps>;
}

export type IconButtonProps = IProps;

const useStyles = makeStyles(
  () => ({
    root: {
      width: 40,
      height: 40,
      // flex fix
      minWidth: 0,
      padding: 12,
    },
    icon: {
      fontSize: 16,
    },
  }),
  { name: 'IuiIconButton' },
);

export function IconButton(props: IProps) {
  const { icon, ...classes } = useStyles();
  const { icon: iconNode, ...rest } = props;
  const clonedIcon = React.cloneElement(iconNode, {
    className: clsx(icon, iconNode.props.className),
  });

  return (
    <Button classes={classes} {...rest}>
      {clonedIcon}
    </Button>
  );
}
