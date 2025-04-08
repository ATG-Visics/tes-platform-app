import { useMemo, forwardRef } from 'react';
import { Button, Link, LinkProps } from '@mui/material';

import { ButtonProps } from '../Button';
import { Icon } from '../Icon';

interface IProps extends Pick<ButtonProps, 'startIcon' | 'endIcon'>, LinkProps {
  buttonProps?: {
    classes?: ButtonProps['classes'];
    children?: LinkProps['children'];
  };
}

export type LinkButtonProps = IProps;

export function LinkButton(props: IProps) {
  const { endIcon, startIcon, buttonProps, ...rest } = props;

  const LinkComponent = useMemo(
    () =>
      // @NOTE Currently not correctly typed due to component attr combined with MuiButton
      // Related links:
      // - https://mui.com/guides/composition/#with-typescript
      // - https://github.com/mui-org/material-ui/issues/22452
      //   - Typescript typings issue with Button component prop in combination with certain other props
      forwardRef<HTMLAnchorElement>((buttonProps, ref) => (
        <Link {...buttonProps} {...rest} ref={ref}>
          {props.children}
        </Link>
      )),
    [props.children, rest],
  );

  return (
    // Ignoring buttonProps for now, currently we need them to override classes added by the Button
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Button
      startIcon={startIcon}
      endIcon={endIcon}
      disableRipple
      component={LinkComponent}
      {...buttonProps}
    >
      {props.children}
    </Button>
  );
}

LinkButton.defaultProps = {
  endIcon: <Icon icon="arrow-right" />,
} as IProps;
