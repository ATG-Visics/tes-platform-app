import React from 'react';
import { SnackbarProvider } from 'notistack';

export function FeedbackToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={5000}
    >
      {children}
    </SnackbarProvider>
  );
}
