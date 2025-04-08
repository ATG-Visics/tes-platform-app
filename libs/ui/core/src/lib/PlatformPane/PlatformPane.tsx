import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';

import { Container } from '../internal/Container';

interface IProps {
  toolbar: ReactNode;
  sidebar: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export type PlatformPaneProps = IProps;

const useStyles = makeStyles(
  ({ spacing, palette }) => ({
    root: {
      maxWidth: 1320,
      margin: '0 auto',
      position: 'relative',
      display: 'flex',
    },
    main: {
      width: '100%',
      backgroundColor: palette.common.white,
    },
    footer: {
      backgroundColor: palette.background.default,
      position: 'sticky',
      bottom: 0,
      marginTop: spacing(4),
      paddingTop: spacing(3),
      paddingBottom: spacing(3),
      boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
    },
  }),
  { name: 'IuiLayout' },
);

/**
 * This Pane is the wrapping container that holds and positions the global elements `sidebar`, `toolbar`, `footer`
 * and of course the content (`children`).
 *
 * Please note that this Component is not the outermost component (the one that also holds the main menu)
 *
 * Relevant designs for this layout (including subcomponents and the outer component) can be found at these links:
 *
 * * https://app.zeplin.io/project/5e53e4e05fd9de7778b827f1/screen/5e53e5e7ae3c706619203476
 * * https://app.zeplin.io/project/5e53e4e05fd9de7778b827f1/screen/5e53e5f8f07fc4655717deac
 * * https://app.zeplin.io/project/5e53e4e05fd9de7778b827f1/screen/5e53e61f367b7f67e42e5219
 *
 */
export function PlatformPane(props: IProps) {
  const { toolbar, sidebar, footer, children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {sidebar}

      <div className={classes.main}>
        {toolbar}

        {toolbar && <Box mt={6} />}

        {children}

        {footer && (
          <div className={classes.footer}>
            <Container>{footer}</Container>
          </div>
        )}
      </div>
    </div>
  );
}
