import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IUnits {
  id: string;
  title: string;
  kind?: string;
}

export const UnitsApi = createApi({
  reducerPath: 'UnitsApi',
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
  tagTypes: ['Units'],
  endpoints: (builder) => ({
    getAllUnits: builder.query<DjangoRestFrameworkResult<IUnits>, unknown>({
      query: () => `units/`,
    }),
    getAllChemicalUnits: builder.query<
      DjangoRestFrameworkResult<IUnits>,
      unknown
    >({
      query: () => `units/`,
      transformResponse: (response: DjangoRestFrameworkResult<IUnits>) => {
        const filteredResponse = response?.results.filter(
          (item) => item.kind === 'chemical',
        );
        return { ...response, results: filteredResponse };
      },
    }),
    getAllMassUnits: builder.query<DjangoRestFrameworkResult<IUnits>, unknown>({
      query: () => `units/`,
      transformResponse: (response: DjangoRestFrameworkResult<IUnits>) => {
        const filteredResponse = response?.results.filter(
          (item) => item.kind === 'mass',
        );
        return { ...response, results: filteredResponse };
      },
    }),
    getAllNoiseUnits: builder.query<DjangoRestFrameworkResult<IUnits>, unknown>(
      {
        query: () => `units/`,
        transformResponse: (response: DjangoRestFrameworkResult<IUnits>) => {
          const filteredResponse = response?.results.filter(
            (item) => item.kind === 'noise',
          );
          return { ...response, results: filteredResponse };
        },
      },
    ),
  }),
});

export const {
  useGetAllUnitsQuery,
  useGetAllChemicalUnitsQuery,
  useGetAllMassUnitsQuery,
  useGetAllNoiseUnitsQuery,
} = UnitsApi;
