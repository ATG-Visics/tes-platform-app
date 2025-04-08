import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DjangoRestFrameworkResult, IOelSourceModel } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

interface IOelSourcePayload {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  search: string;
  filterParams?: { [key: string]: string };
}

export const OelSourceApi = createApi({
  reducerPath: 'OelSourceApi',
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
  tagTypes: ['OelSource'],
  endpoints: (builder) => ({
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
      providesTags: (result) =>
        result && result.results
          ? [
              ...result.results.map(({ id }) => ({
                type: 'OelSource' as const,
                id,
              })),
              { type: 'OelSource', id: 'LIST' },
            ]
          : [{ type: 'OelSource', id: 'LIST' }],
    }),
  }),
});

export const { useGetAllOelSourcesQuery } = OelSourceApi;
