import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { OrderDirection } from '../instrumentSlice';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

export interface IInstrumentListItem {
  id: string;
  title: string;
  updatedAt: string;
}

export interface IInstrument {
  id: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  account: string;
}

export interface IInstrumentModel {
  id: string;
  title: string;
  instrumentType: 'chemical' | 'noise';
  instrumentSet: Array<IInstrument>;
  media: string;
  calibrationDevices: Array<{
    id: string;
    title: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface IInstrumentPayload {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  search: string;
  filterParams?: { [key: string]: string };
}

export interface IInstrumentFormPayload {
  title: string;
  instrumentSet: Array<{
    serialNumber: string;
  }>;
  calibrationDevices?: Array<{
    id: string;
    title: string;
  }>;
}

export const InstrumentApi = createApi({
  reducerPath: 'InstrumentApi',
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
  tagTypes: ['Instrument'],
  endpoints: (builder) => ({
    getAllInstruments: builder.query<
      DjangoRestFrameworkResult<IInstrumentModel>,
      IInstrumentPayload
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
          url: 'instrument-models/',
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
                type: 'Instrument' as const,
                id,
              })),
              { type: 'Instrument', id: 'LIST' },
            ]
          : [{ type: 'Instrument', id: 'LIST' }],
    }),
    getInstrumentById: builder.query<IInstrumentModel, string>({
      query: (uuid) => `instrument-models/${uuid}/`,
      providesTags: (arg) => [{ type: 'Instrument', id: arg?.id }],
      transformResponse: (response: IInstrumentModel) => {
        const serialNumbersList = response.instrumentSet.map(
          (item) => item.serialNumber,
        );
        return { ...response, serialNumbers: serialNumbersList };
      },
    }),

    updateInstrument: builder.mutation<
      IInstrument,
      { uuid: string; body: Partial<IInstrumentFormPayload> }
    >({
      query: (params) => {
        const { uuid, body } = params;
        return {
          url: `instrument-models/${uuid}/`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Instrument', id: arg?.id }],
    }),
    createInstrument: builder.mutation<
      IInstrument,
      Partial<IInstrumentFormPayload>
    >({
      query: (params) => {
        return {
          url: `instrument-models/`,
          method: 'POST',
          body: params,
        };
      },
      invalidatesTags: [{ type: 'Instrument', id: 'LIST' }],
    }),
    deleteInstrument: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query(id) {
        return {
          url: `instrument-models/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [{ type: 'Instrument', id: 'LIST' }],
    }),
    createInstrumentSerialNumbers: builder.mutation<
      { status: string },
      { uuid: string; body: Array<string> | undefined }
    >({
      query: (params) => {
        const { uuid, body } = params;

        return {
          url: `instrument-models/${uuid}/instrument/`,
          method: 'POST',
          body: { serialNumbers: body },
        };
      },
    }),
  }),
});

export const {
  useGetAllInstrumentsQuery,
  useGetInstrumentByIdQuery,
  useUpdateInstrumentMutation,
  useCreateInstrumentMutation,
  useDeleteInstrumentMutation,
  useCreateInstrumentSerialNumbersMutation,
} = InstrumentApi;
