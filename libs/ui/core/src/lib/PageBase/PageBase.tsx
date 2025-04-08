import React from 'react';

interface IProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  hasBackButton?: boolean;
}

export type PageBaseProps = IProps;

export function PageBase({ children, header, footer = null }: IProps) {
  return (
    <>
      {header}

      {children}

      {footer}
    </>
  );
}
