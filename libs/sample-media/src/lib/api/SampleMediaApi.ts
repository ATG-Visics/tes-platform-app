import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { OrderDirection } from '../sampleMedia.slice';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

export interface ISampleMediaListItem {
  id: string;
  title: string;
}

export interface ISampleMedia {
  id: string;
  title: string;
}

export interface ISampleMediaPayload {
  page: number;
  limit: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
  filterParams: { [key: string]: string };
}

export const SampleMediaApi = createApi({
  reducerPath: 'SampleMediaApi',
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
  tagTypes: ['Media'],
  endpoints: (builder) => ({
    getAllSampleMedia: builder.query<
      DjangoRestFrameworkResult<ISampleMediaListItem>,
      Partial<ISampleMediaPayload>
    >({
      query: (params) => {
        const {
          page = 0,
          limit = 10,
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
          url: 'sample-media/',
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
                type: 'Media' as const,
                id,
              })),
              { type: 'Media', id: 'LIST' },
            ]
          : [{ type: 'Media', id: 'LIST' }],
    }),
    getSampleMediaById: builder.query<ISampleMedia, string>({
      query: (id) => `/sample-media/${id}`,
      providesTags: (arg) => [{ type: 'Media', id: arg?.id }],
    }),
    createSampleMedia: builder.mutation<ISampleMedia, Partial<ISampleMedia>>({
      query: (body) => {
        return {
          url: `sample-media/`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: [{ type: 'Media', id: 'LIST' }],
    }),
    updateSampleMediaById: builder.mutation<
      ISampleMedia,
      { uuid: string; body: Partial<ISampleMedia> }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `sample-media/${uuid}/`,
          method: 'PUT',
          body: body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Media', id: arg?.id }],
    }),
    deleteSampleMedia: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query(id) {
        return {
          url: `/sample-media/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [{ type: 'Media', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllSampleMediaQuery,
  useGetSampleMediaByIdQuery,
  useCreateSampleMediaMutation,
  useUpdateSampleMediaByIdMutation,
  useDeleteSampleMediaMutation,
} = SampleMediaApi;
