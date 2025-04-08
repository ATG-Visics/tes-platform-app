import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PageDefault } from '@tes/ui/core';
import { Container, Toolbar } from '@mui/material';

export function PlatformBaseLayout() {
  const [hasBackButton, setHasBackButton] = useState<boolean>(false);

  return (
    <PageDefault hasBackButton={hasBackButton}>
      <Container
        sx={{
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Outlet context={[hasBackButton, setHasBackButton]} />
      </Container>
    </PageDefault>
  );
}
