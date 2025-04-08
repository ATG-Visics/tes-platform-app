import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { OrderDirection } from '../calibration.slice';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

export interface ICalibrationListItem {
  id: string;
  title: string;
  updatedAt: string;
}

export interface ICalibration {
  id: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  account: string;
}

export interface ICalibrationModel {
  id: string;
  title: string;
  calibrationInstrumentSet: Array<ICalibration>;
  createdAt: string;
  updatedAt: string;
}

interface ICalibrationPayload {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  search: string;
  filterParams?: { [key: string]: string };
}

export interface ICalibrationFormPayload {
  title: string;
  calibrationInstrumentSet: Array<{
    serialNumber: string;
  }>;
}

export const CalibrationApi = createApi({
  reducerPath: 'CalibrationApi',
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
  tagTypes: ['Calibration'],
  endpoints: (builder) => ({
    getAllCalibrationDevices: builder.query<
      DjangoRestFrameworkResult<ICalibrationModel>,
      ICalibrationPayload
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
          url: 'calibration-instrument-models/',
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
                type: 'Calibration' as const,
                id,
              })),
              { type: 'Calibration', id: 'LIST' },
            ]
          : [{ type: 'Calibration', id: 'LIST' }],
    }),
    getCalibrationDevicesById: builder.query<ICalibrationModel, string>({
      query: (uuid) => `calibration-instrument-models/${uuid}/`,
      transformResponse: (response: ICalibrationModel) => {
        const serialNumbersList = response.calibrationInstrumentSet.map(
          (item) => item.serialNumber,
        );
        return { ...response, serialNumbers: serialNumbersList };
      },
      providesTags: (arg) => [{ type: 'Calibration', id: arg?.id }],
    }),
    updateCalibrationDevices: builder.mutation<
      ICalibrationModel,
      { uuid: string; body: Partial<ICalibrationFormPayload> }
    >({
      query: (params) => {
        const { uuid, body } = params;
        return {
          url: `calibration-instrument-models/${uuid}/`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Calibration', id: arg?.id }],
    }),
    createCalibrationDevices: builder.mutation<
      ICalibrationModel,
      Partial<ICalibrationFormPayload>
    >({
      query: (params) => {
        return {
          url: `calibration-instrument-models/`,
          method: 'POST',
          body: params,
        };
      },
      invalidatesTags: [{ type: 'Calibration', id: 'LIST' }],
    }),
    deleteCalibrationDevices: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query(id) {
        return {
          url: `calibration-instrument-models/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [{ type: 'Calibration', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllCalibrationDevicesQuery,
  useGetCalibrationDevicesByIdQuery,
  useUpdateCalibrationDevicesMutation,
  useCreateCalibrationDevicesMutation,
  useDeleteCalibrationDevicesMutation,
} = CalibrationApi;
