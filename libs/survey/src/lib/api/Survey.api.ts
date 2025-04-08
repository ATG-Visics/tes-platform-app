import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { OrderDirection } from '@tes/client';
import { AuthenticationState } from '@tes/authentication';

export interface ISurveyListItem {
  id: string;
  startDate: string;
  samplers: {
    sampler: string;
  }[];
  sampleCount: number;
  resultCount: number;
  lastUpdate: string;
  project: string;
}

interface ISurveyMomentPayload {
  page: number;
  limit: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
  filterParams: { [key: string]: string };
  project: string;
}

export const SurveyMomentApi = createApi({
  reducerPath: 'SurveyMomentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as { authentication: AuthenticationState };
      const accessToken = state['authentication'].accessToken;
      headers.set('Authorization', `Bearer ${accessToken}`);
      return headers;
    },
  }),
  tagTypes: ['SurveyMoment'],
  endpoints: (builder) => ({
    getAllSurveyMoments: builder.query<
      DjangoRestFrameworkResult<ISurveyListItem>,
      Partial<ISurveyMomentPayload>
    >({
      query: (params) => {
        const {
          page = 0,
          limit = 10,
          search,
          orderBy = '',
          orderDirection = OrderDirection.ASC,
          filterParams = {},
          project = '',
        } = params || {};

        let ordering = '';
        if (orderBy !== '') {
          ordering = orderBy;

          if (orderDirection === OrderDirection.DESC) {
            ordering = `-${ordering}`;
          }
        }

        return {
          url: 'survey-moments/',
          params: {
            ...filterParams,
            search,
            limit: limit,
            ordering,
            offset: page * limit,
            project: project,
          },
        };
      },
    }),
  }),
});

export const { useGetAllSurveyMomentsQuery } = SurveyMomentApi;
