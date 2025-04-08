import { ElementType } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

export type TextProps = {
  strong?: boolean;
  underline?: boolean;
  component?: ElementType<'span'> | string;
} & TypographyProps;

const useStyles = makeStyles(
  () => ({
    root: {},
    strong: {
      fontWeight: 'bold',
    },
    underline: {
      textDecoration: 'underline',
    },
  }),
  { name: 'IuiText' },
);

export function Text(props: TextProps) {
  const classes = useStyles();
  const { className, variant = 'body1', strong, underline, ...rest } = props;

  const classNames = clsx(
    className,
    classes.root,
    (classes as Record<string, string | undefined>)[variant],
    {
      [classes.underline]: underline,
      [classes.strong]: strong,
    },
  );

  return (
    <Typography
      component={strong ? 'strong' : void 0}
      {...rest}
      variant={variant}
      className={classNames}
    />
  );
}

export function Strong({
  strong = true,
  display = 'inline',
  ...rest
}: TextProps) {
  return <Text strong={strong} display={display} {...rest} />;
}

export function Caption({ variant = 'caption', ...rest }: TextProps) {
  return <Text variant={variant} {...rest} />;
}

export function Overline({ variant = 'overline', ...rest }: TextProps) {
  return <Text variant={variant} {...rest} />;
}

export function H1({ variant = 'h1', component = 'h1', ...rest }: TextProps) {
  return <Text variant={variant} component={component} {...rest} />;
}
export function H2({ variant = 'h2', component = 'h2', ...rest }: TextProps) {
  return <Text variant={variant} component={component} {...rest} />;
}
export function H3({ variant = 'h3', component = 'h3', ...rest }: TextProps) {
  return <Text variant={variant} component={component} {...rest} />;
}
export function H4({ variant = 'h4', component = 'h4', ...rest }: TextProps) {
  return <Text variant={variant} component={component} {...rest} />;
}
export function H5({ variant = 'h5', component = 'h5', ...rest }: TextProps) {
  return <Text variant={variant} component={component} {...rest} />;
}
export function H6({ variant = 'h6', component = 'h6', ...rest }: TextProps) {
  return <Text variant={variant} component={component} {...rest} />;
}
