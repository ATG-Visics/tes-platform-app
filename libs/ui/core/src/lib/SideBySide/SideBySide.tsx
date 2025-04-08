import { Grid } from '@mui/material';
import { ReactNode } from 'react';

import { Container } from '../internal/Container';

interface IProps {
  children: ReactNode;
}

export type SideBySideProps = IProps;

export function SideBySide(props: IProps) {
  const { children } = props;

  return (
    <Container>
      <Grid container spacing={4}>
        {children}
      </Grid>
    </Container>
  );
}
