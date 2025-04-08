import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomNavigate } from '../hooks';
import { Link as MuiLink } from '@mui/material';

interface IProps {
  name: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
  useExistingParams?: boolean;
}

export function RouterLink({
  name,
  params,
  query,
  children,
  useExistingParams = true,
  className,
}: IProps) {
  const { getRoutePath } = useCustomNavigate();

  const to = getRoutePath(name, params, query, useExistingParams);

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export function MuiRouterLink({
  name,
  params,
  query,
  useExistingParams = true,
  children,
}: IProps) {
  const { getRoutePath } = useCustomNavigate();

  const to = getRoutePath(name, params, query, useExistingParams);

  return (
    <MuiLink
      to={to}
      component={Link}
      sx={{
        textDecoration: 'none',
        color: (theme) => theme.palette.text.secondary,
      }}
    >
      {children}
    </MuiLink>
  );
}
