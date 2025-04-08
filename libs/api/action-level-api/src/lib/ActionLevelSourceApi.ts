import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult, IOelSourceModel } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

interface IQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderDirection?: OrderDirection;
  search: string;
  filterParams: { [key: string]: string };
}

interface IActionLevelListResponse {
  id: string;
  title: string;
}

interface IOelSourcePayload {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  search: string;
  filterParams?: { [key: string]: string };
}

export const ActionLevelSourceApi = createApi({
  reducerPath: 'ActionLevelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as {
        authentication: AuthenticationState;
        accounts: AccountsState;
      };
      const accessToken = state['authentication'].accessToken;
      headers.set('Authorization', `Bearer ${accessToken}`);

      const accountToken = state['accounts'].accountId;
      headers.set('account', `${accountToken}`);
      return headers;
    },
  }),
  tagTypes: ['ActionLevels'],
  endpoints: (builder) => ({
    getAllActionLevels: builder.query<
      DjangoRestFrameworkResult<IActionLevelListResponse>,
      Partial<IQueryParams>
    >({
      query: (params) => {
        const {
          page = 0,
          limit = 50,
          orderBy = '',
          orderDirection = OrderDirection.ASC,
          search,
          filterParams = {},
        } = params || {};

        let ordering = '';
        if (orderBy !== '') {
          ordering = orderBy;

          if (orderDirection === OrderDirection.DESC) {
            ordering = `-${ordering}`;
          }
        }
        return {
          url: 'action-level-source/',
          params: {
            ...filterParams,
            search,
            limit: limit,
            ordering,
            offset: page * limit,
          },
        };
      },
      transformResponse: (
        response: DjangoRestFrameworkResult<IActionLevelListResponse>,
      ) => ({
        ...response,
        results: [
          ...response.results,
          { id: null as unknown as string, title: 'N/A' },
        ],
      }),
      providesTags: (result) =>
        result && result.results
          ? [
              ...result.results.map(({ id }) => ({
                type: 'ActionLevels' as const,
                id,
              })),
              { type: 'ActionLevels', id: 'LIST' },
            ]
          : [{ type: 'ActionLevels', id: 'LIST' }],
    }),
    getAllOelSources: builder.query<
      DjangoRestFrameworkResult<IOelSourceModel>,
      IOelSourcePayload
    >({
      query: (params) => {
        const {
          page = 0,
          limit = 50,
          orderBy = '',
          orderDirection = OrderDirection.ASC,
          search,
          filterParams = {},
        } = params || {};

        let ordering = '';
        if (orderBy !== '') {
          ordering = orderBy;

          if (orderDirection === OrderDirection.DESC) {
            ordering = `-${ordering}`;
          }
        }

        return {
          url: 'oel-source/',
          params: {
            ...filterParams,
            search,
            limit: limit,
            ordering,
            offset: page * limit,
          },
        };
      },
    }),
  }),
});

export const { useGetAllActionLevelsQuery, useGetAllOelSourcesQuery } =
  ActionLevelSourceApi;
