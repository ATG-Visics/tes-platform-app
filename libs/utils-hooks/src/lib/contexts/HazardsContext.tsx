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

interface IHazards {
  id: string;
  title: string;
  casNumber: string;
  hazardType?: string;
}

interface IProps {
  hazardType?: string;
  useGetAllQuery: UseQuery<
    QueryDefinition<
      {
        hazardType?: string;
        searchTitle?: string;
      },
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      string,
      DjangoRestFrameworkResult<IHazards>,
      string
    >
  >;
}

export type HazardContextProps = IProps;

export const HazardsContext = createContext<IProps | null>(null);
