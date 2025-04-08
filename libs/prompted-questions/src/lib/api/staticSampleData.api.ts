import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { AuthenticationState } from '@tes/authentication';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AccountsState } from '@tes/accounts';

interface ISampleListItem {
  id: string;
  sampleId: string;
  surveyMoment: {
    project: string;
    startDate: string;
  };
  sampleType: string;
  type: string;
  sampler: string;
  instrument: {
    id: string;
    serialNumber: string;
    model: string;
  };
  endTime: string;
  calibratedWith: string | null;
  personSampleSubject: string;
  areaSampleSubject: string;
  hazards: Array<{ id: string; title: string }>;
  startTime: string;
  checkins: Array<ILastChecked>;
  twaCalculationMethod: string;
  medium: string;
  mediumSerialNumber: string;
  hasResults: boolean;
}

interface ILastChecked {
  id: string;
  createdAt: string;
  sample: string;
}

export const StaticSampleSubjectDataApi = createApi({
  reducerPath: 'SampleApi',
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
  tagTypes: ['Sample'],
  endpoints: (builder) => ({
    getAllSamplesBySurveyMoment: builder.query<
      DjangoRestFrameworkResult<ISampleListItem>,
      {
        surveyMomentId: {
          project: string;
          startDate: string;
        };
      }
    >({
      query: ({ surveyMomentId }) => {
        return {
          url: `samples/`,
          params: {
            survey_moment__start_date: surveyMomentId.startDate,
            survey_moment__project: surveyMomentId.project,
          },
        };
      },
      providesTags: (result) =>
        result && result.results
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Sample' as const,
                id: id,
              })),
            ]
          : [{ type: 'Sample', id: 'LIST' }],
    }),
  }),
});

export const { useGetAllSamplesBySurveyMomentQuery } =
  StaticSampleSubjectDataApi;
