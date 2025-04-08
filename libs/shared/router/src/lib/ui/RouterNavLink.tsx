import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCustomNavigate } from '../hooks';

interface IProps {
  name: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  useExistingParams?: boolean;
  children: React.ReactNode;
  className?: string;
  style?:
    | React.CSSProperties
    | ((props: { isActive: boolean }) => React.CSSProperties);
  end?: boolean;
}

export function RouterNavLink({
  name,
  params,
  query,
  useExistingParams = true,
  children,
  className,
  style,
  end,
}: IProps) {
  const { getRoutePath } = useCustomNavigate();

  const to = getRoutePath(name, params, query, useExistingParams);

  return (
    <NavLink to={to} className={className} style={style} end={end}>
      {children}
    </NavLink>
  );
}
