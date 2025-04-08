import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

import { IconProps } from '../Icon';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends IconButtonProps {
  icon: React.ReactElement<IconProps>;
}

export type ShareButtonProps = IProps;

const useStyles = makeStyles(
  () => ({
    root: {
      width: 40,
      height: 40,
      padding: 10,
    },
    icon: {
      width: 20,
      height: 20,
    },
  }),
  { name: 'IuiShareButton' },
);

export function ShareButton(props: IProps) {
  const { icon, ...classes } = useStyles();
  const { className, icon: iconNode, ...rest } = props;

  const clonedIcon = React.cloneElement(iconNode, {
    className: clsx(icon, iconNode.props.className),
  });

  return (
    <IconButton className={clsx(className, classes.root)} {...rest}>
      {clonedIcon}
    </IconButton>
  );
}
