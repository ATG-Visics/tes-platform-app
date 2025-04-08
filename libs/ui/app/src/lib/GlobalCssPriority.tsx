import { ReactNode } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

export function GlobalCssPriority({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Inject Emotion before JSS */}
      <StyledEngineProvider injectFirst>
        {/* Your component tree. Now you can override MUI's styles. */}
        {children}
      </StyledEngineProvider>
    </>
  );
}
