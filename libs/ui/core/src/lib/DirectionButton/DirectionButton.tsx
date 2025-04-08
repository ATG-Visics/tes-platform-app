import { Button, ButtonProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useMemo } from 'react';
import clsx from 'clsx';

import { Icon } from '../Icon';

interface IProps extends ButtonProps {
  direction: 'previous' | 'next';
  label: string;
  subtitle: string;
  IconComponent?: (props: { icon?: string; className?: string }) => JSX.Element;
}

export type DirectionButtonProps = IProps;

const useStyles = makeStyles(
  ({ spacing, breakpoints }) => ({
    root: {
      minWidth: 52,
      minHeight: 52,
      padding: spacing(2),

      [breakpoints.up('sm')]: {
        minWidth: 268, // 600 / 2 - 32px
        maxWidth: '45vw',
        height: 100,
      },
    },

    previous: {
      width: 52,
      height: 52,

      [breakpoints.up('sm')]: {
        width: '100%',
        height: 100,
      },
    },
    next: {
      width: '100%',
    },

    label: {
      display: 'none',

      [breakpoints.up('sm')]: {
        display: 'block',
        marginTop: spacing(1), // design doesn't account line-height so instead of 12 we use 8
      },
    },
    subtitle: {
      display: 'block',

      [breakpoints.up('sm')]: {
        fontSize: 12,
        lineHeight: 1.33,
        fontWeight: 'normal',
      },
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      flexDirection: 'row-reverse',

      '$next &': {
        flexDirection: 'row',
      },
    },
    textContainer: {
      flexGrow: 1,
      fontWeight: 900,
      fontSize: 16,
      lineHeight: 1.25,
      alignSelf: 'flex-start',
      maxWidth: 270,

      '$previous &': {
        display: 'none',
        textAlign: 'right',
      },

      '$next &': {
        textAlign: 'left',
      },

      [breakpoints.up('sm')]: {
        '$previous &': {
          display: 'initial',
        },
      },
    },

    spacer: {
      display: 'inline-block',

      '$previous &': {
        width: 0,
      },

      '$next &': {
        width: spacing(2),
      },

      [breakpoints.up('sm')]: {
        width: spacing(4),
      },
    },

    icon: {
      fontSize: 16,

      [breakpoints.up('sm')]: {
        fontSize: 24,
      },
    },

    iconPrevious: {},
    iconNext: {},
  }),
  { name: 'IuiDirectionButton' },
);

enum ColorOptions {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

enum IconMap {
  NEXT = 'arrow-right',
  PREV = 'arrow-left',
}

function useDirectionButtonProps(props: DirectionButtonProps) {
  return useMemo(() => {
    const { label, subtitle, IconComponent, direction, ...rest } = props;
    const isNext = direction === 'next';
    const color = props.color
      ? props.color
      : isNext
      ? ColorOptions.PRIMARY
      : ColorOptions.SECONDARY;

    const buttonProps = {
      ...rest,
      color,
    };

    const iconProps = {
      icon: isNext ? IconMap.NEXT : IconMap.PREV,
    };

    return {
      buttonProps,
      iconProps,
    };
  }, [props]);
}

export function DirectionButton(props: DirectionButtonProps) {
  const { IconComponent = Icon, direction } = props;
  const { buttonProps, iconProps } = useDirectionButtonProps(props);
  const isPrevious = direction === 'previous';
  const isNext = direction === 'next';

  const classes = useStyles();

  return (
    <Button
      classes={{
        root: clsx(classes.root, {
          [classes.previous]: isPrevious,
          [classes.next]: isNext,
        }),
        // label: classes.container,
      }}
      variant="contained"
      {...buttonProps}
    >
      <div className={classes.textContainer}>
        <span className={classes.subtitle}>{props.subtitle}</span>
        <span className={classes.label}>{props.label}</span>
      </div>

      <span className={classes.spacer} />

      <IconComponent
        {...iconProps}
        className={clsx(classes.icon, {
          [classes.iconPrevious]: isPrevious,
          [classes.iconNext]: isNext,
        })}
      />
    </Button>
  );
}
