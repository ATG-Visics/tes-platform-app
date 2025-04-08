import React from 'react';
import { makeStyles } from '@mui/styles';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import {
  findIconDefinition,
  IconDefinition,
  IconName,
  IconLookup,
} from '@fortawesome/fontawesome-svg-core';
import invariant from 'invariant';

interface IProps {
  icon: IconName | IconDefinition | string;
  highlight?: boolean;
  prefix?: IconLookup['prefix'];
  className?: string;
  // @TODO Discuss if we need to support all sizes.
  size?: FontAwesomeIconProps['size'];
}

export type IconProps = IProps;

const useStyles = makeStyles(
  () => ({
    root: {},
    highlight: {},
    icon: {},
    defaultSize: {
      fontSize: 'inherit',
    },
  }),
  { name: 'IuiIcon' },
);

export function Icon(props: IProps) {
  const classes = useStyles();
  const { className, icon, highlight, prefix, ...rest } = props;

  const iconDefinition = React.useMemo(() => {
    if (typeof icon !== 'string') {
      return icon;
    }

    let def;

    if (!prefix) {
      // far = font awesome pro library
      def = findIconDefinition({ prefix: 'far', iconName: icon as IconName });

      if (!def) {
        // fas = font awesome free library
        def = findIconDefinition({ prefix: 'fas', iconName: icon as IconName });
      }

      if (!def) {
        // fas = font awesome free brands library
        def = findIconDefinition({ prefix: 'fab', iconName: icon as IconName });
      }
    } else {
      def = findIconDefinition({ prefix, iconName: icon as IconName });

      invariant(!!def, `Unable to find icon "${icon}" in "${prefix}"`);
    }

    // Typescript can't handle the amount of unions
    // (fontawesome exports about 3000 icon names as types)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (def || icon) as IconDefinition;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }, [icon, prefix]);

  const combinedClasses = clsx(className, classes.root, classes.icon, {
    [classes.highlight]: highlight,
    [classes.defaultSize]: !props.size,
  });

  return (
    <FontAwesomeIcon
      className={combinedClasses}
      icon={iconDefinition}
      {...rest}
    />
  );
}

Icon.defaultProps = {
  prefix: 'fas',
} as IProps;
