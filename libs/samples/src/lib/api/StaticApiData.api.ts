import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

export const StaticApiDataApi = createApi({
  reducerPath: 'StaticApiDataApi',
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
  refetchOnFocus: true,
  tagTypes: ['ApiData'],
  endpoints: (builder) => ({
    getAllSampleMediaStatic: builder.query<
      DjangoRestFrameworkResult<{ id: string; title: string }>,
      { searchTitle?: string }
    >({
      query: ({ searchTitle }) => {
        return {
          url: `sample-media/`,
          params: {
            search: searchTitle,
          },
        };
      },
    }),
    getAllInstrumentsStatic: builder.query<
      DjangoRestFrameworkResult<{ id: string; title: string }>,
      { searchTitle?: string }
    >({
      query: ({ searchTitle }) => {
        return {
          url: `instrument-models/`,
          params: {
            search: searchTitle,
          },
        };
      },
    }),
    getAllCalibrationInstrumentsStatic: builder.query<
      DjangoRestFrameworkResult<{ id: string; title: string }>,
      { searchTitle?: string }
    >({
      query: ({ searchTitle }) => {
        return {
          url: `calibration-instrument-models/`,
          params: {
            search: searchTitle,
          },
        };
      },
    }),
  }),
});

export const {
  useGetAllSampleMediaStaticQuery,
  useGetAllInstrumentsStaticQuery,
  useGetAllCalibrationInstrumentsStaticQuery,
} = StaticApiDataApi;
