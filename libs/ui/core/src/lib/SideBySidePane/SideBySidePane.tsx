import { Grid } from '@mui/material';
import { GridProps } from '@mui/material/Grid/Grid';
import { ReactNode } from 'react';

interface IProps extends GridProps {
  children: ReactNode;
  item?: true;
}

export type SideBySidePaneProps = IProps;

export function SideBySidePane(props: IProps) {
  const { children } = props;
  return (
    <Grid {...props} item>
      {children}
    </Grid>
  );
}
SideBySidePane.defaultProps = {
  md: 6,
};
