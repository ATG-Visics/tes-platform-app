import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { createContext } from 'react';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from '@reduxjs/toolkit/query';
import { DjangoRestFrameworkResult } from '../djangorestframework';

interface IReadData {
  id: string;
  title: string;
}

interface IProps {
  useGetAllQuery: UseQuery<
    QueryDefinition<
      unknown,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      never,
      DjangoRestFrameworkResult<IReadData>,
      string
    >
  >;
}

export type WeldingContextProps = IProps;

export const WeldingContext = createContext<IProps | null>(null);
