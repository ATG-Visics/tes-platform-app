import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

interface SamplingPlanChartResponse {
  countsByMonth: Array<{
    date: string;
    count: number;
  }>;
  targetSampleCount: number;
  currentSampleCount: number;
}

export const SamplingPlanChartApi = createApi({
  reducerPath: 'SamplingPlanChartApi',
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
  tagTypes: ['SamplingPlanChart'],
  endpoints: (builder) => ({
    getSamplingPlanChartData: builder.query<SamplingPlanChartResponse, string>({
      query: (projectId) => `sampling-plans/sample-history/${projectId}`,
    }),
  }),
});

export const { useGetSamplingPlanChartDataQuery } = SamplingPlanChartApi;
