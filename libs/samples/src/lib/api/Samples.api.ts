import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { OrderDirection } from '../sample.slice';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

export interface ISampleListItem {
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
  calibratedWith: string | null;
  personSampleSubject: string;
  areaSampleSubject: string;
  hazards: Array<{ id: string; title: string }>;
  captureTimes: ICaptureTime[];
  checkins: Array<ILastChecked>;
  twaCalculationMethod: string;
  medium: string;
  mediumSerialNumber: string;
  hasResults: boolean;
  isOverloaded: boolean;
}

interface ISamplePayload {
  page: number;
  limit: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
  filterParams: { [key: string]: string };
}

export interface ISampleListItemPayload {
  id: string;
  sampleId: string;
  samplingPlan: string;
  surveyMoment: {
    project: string;
    startDate: string;
  };
  sampleType: string;
  sampler: string;
  medium: { id: string; title: string };
  instrument: { id: string; title: string };
  calibratedWith: { id: string; title: string };
  personSampleSubject: string;
  areaSampleSubject: string;
  hazards: string[];
  startTime: string;
  checkins: Array<ILastChecked>;
  twaCalculationMethod: string;
  endTime: string;
  finalFlowRate: string;
  type: string;
}

export interface ICaptureTime {
  startTime: string;
  endTime: string;
  duration: string;
}

export interface ISample {
  id: string;
  samplingPlan: string;
  surveyMoment: {
    id: string;
    startDate: string;
    project: string;
  };
  instrument: {
    id: string;
    serialNumber: string;
    model: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      instrumentType: 'noise' | 'chemical';
    };
  };
  calibratedWith: {
    id: string;
    model: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
    };
    serialNumber: string;
  };
  captureTimes: ICaptureTime[];
  medium: {
    id: string;
    title: string;
  };
  mediumSerialNumber: string;
  personSampleSubject: null | string;
  areaSampleSubject: null | string;
  sampleId: string;
  sampleType: string;
  sampler: string;
  averageFlowRate: number;
  durationInMinutes: number;
  type: string;
  hazards: Array<{
    title: string;
    id: string;
    casNumber: string;
    isOverloaded: boolean;
  }>;
  initialFlowRate: string;
  finalFlowRate: string;
  twaCalculationMethod: {
    id: string;
    title: string;
  };
  checkins: Array<ILastChecked>;
}

export interface ISampleExtended {
  id: string;
  samplingPlan: string;
  surveyMoment: {
    id: string;
    startDate: string;
    project: string;
  };
  instrument: {
    id: string;
    serialNumber: string;
    model: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      instrumentType: 'noise' | 'chemical';
    };
  };
  calibratedWith: {
    id: string;
    model: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
    };
    serialNumber: string;
  };
  captureTimes: ICaptureTime[];
  personSampleSubject: null | {
    id: string;
  };
  areaSampleSubject: null | {
    id: string;
  };
  medium: {
    id: string;
    title: string;
  };
  mediumSerialNumber: string;
  sampleId: string;
  sampleType: string;
  sampler: string;
  hazards: Array<{
    title: string;
    id: string;
    casNumber: string;
    isOverloaded: boolean;
  }>;
  initialFlowRate: string;
  finalFlowRate: string;
  averageFlowRate: number;
  durationInMinutes: number;
  type: string;
  twaCalculationMethod: {
    id: string;
    title: string;
  };
  checkins: Array<ILastChecked>;
}

export interface ILastChecked {
  id: string;
  createdAt: string;
  sample: string;
}

export interface IResultsPayload {
  sample?: string;
  sampleType: string;
  twaCalculationMethod?: string;
  hazard?: string;
  acgihNoishDba?: string;
  acgihNoishDose?: string;
  oshaHcpDba?: string;
  oshaHcpDose?: string;
  oshaPelDba?: string;
  oshaPelDose?: string;
  lasMaxDba?: string;
}

export interface ISampleResultListItem {
  hazard: string;
  id: string;
  lodSr2: string;
  method: string;
  oel: string;
  reportLimit: string;
  sample: string;
  total: string;
  twaCalculationMethod: string;
  twaResult: string;
  sampleResult: string;
  unit: string;
  volume: string;
  totalMass: string;
  totalMassUnit: string;
}

export interface ISampleUpdatePayload {
  id: string;
  surveyMoment: {
    startDate: string;
    project: string;
  };
  samplingPlan: string;
  hazards: Array<{ title: string; id: string }> | Array<string>;
  sampleId: string;
  sampler: string;
  initialFlowRate: string;
  finalFlowRate: string | null | number;
  startTime: string;
  endTime: string;
  medium: { id?: string; title?: string };
  instrument: { id?: string; title?: string };
  calibratedWith: { id?: string; title?: string };
  personSampleSubject: string;
  areaSampleSubject: string;
  twaCalculationMethod: string;
}

export interface ISampleResultNoiseListItem {
  id: string;
  oel: string;
  lodSr2: string;
  sample: string;
  unit: {
    id: string;
    title: string;
  };
  hazard: {
    id: string;
    title: string;
  };
  al: number;
  acgihNoishDba: string;
  acgihNoishDose: string;
  oshaHcpDba: string;
  oshaHcpDose: string;
  oshaPelDba: string;
  oshaPelDose: string;
  lasMaxDba: string;
}

export interface INoiseResult {
  id: string;
  oel: string;
  lodSr2: string | null;
  sample: string;
  unit: string;
  hazard: string;
  al: number;
  acgihNoishDba: string;
  acgihNoishDose: string;
  oshaHcpDba: string;
  oshaHcpDose: string;
  oshaPelDba: string;
  oshaPelDose: string;
  lasMaxDba: string;
  isOverloaded: boolean;
}

export interface INoiseResultPayload {
  oel: string;
  lodSr2: string | null;
  sample: string;
  unit: string;
  hazard: string;
  al: number;
  acgihNoishDba: string;
  acgihNoishDose: string;
  oshaHcpDba: string;
  oshaHcpDose: string;
  oshaPelDba: string;
  oshaPelDose: string;
  lasMaxDba: string;
}

export interface IChemicalResult {
  id: string;
  oel: string | number;
  lodSr2: string | null;
  sample: string;
  unit: string;
  hazard: string;
  method: string;
  volume: string | number;
  reportLimit: string | null;
  total: string | number;
  isLessThan: string | null;
  isLessThanTwa: string | null;
  twaResult: string;
  sampleResult: string | null;
  twaCalculationMethod: string;
  totalMass: string;
  totalMassUnit: string;
  casNumber: string;
  al: string | number;
}

export interface ISampleResultResponse extends ISample {
  sample?: string;
}

export const SampleApi = createApi({
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
    getAllSamples: builder.query<
      DjangoRestFrameworkResult<ISampleListItem>,
      Partial<ISamplePayload>
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
          url: `samples/`,
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
    getSampleById: builder.query<ISample, string>({
      query: (uuid) => `samples/${uuid}/`,
      transformResponse: (response: ISampleExtended) => {
        return {
          ...response,
          useSamplingPlan: response.samplingPlan
            ? 'samplingPlan'
            : 'noSamplingPlan',
          surveyMoment: {
            id: response.surveyMoment.id,
            project: response.surveyMoment.project,
            startDate: response.surveyMoment.startDate,
          },
          areaSampleSubject: response.areaSampleSubject
            ? response.areaSampleSubject.id
            : null,
          personSampleSubject: response.personSampleSubject
            ? response.personSampleSubject.id
            : null,
        };
      },
      providesTags: (arg) => [{ type: 'Sample', id: arg?.id }],
    }),
    createSample: builder.mutation<
      ISampleListItem,
      Partial<ISampleListItemPayload>
    >({
      query: (body) => {
        const instrument = body.instrument?.id
          ? body.instrument?.id.split('|')
            ? body.instrument?.id.split('|')[0].trim()
            : body.instrument?.id
          : null;
        return {
          url: 'samples/',
          method: 'POST',
          body: {
            ...body,
            medium: body.medium?.id,
            instrument: instrument,
            calibratedWith: body.calibratedWith?.id,
            samplingPlan: body.samplingPlan,
          },
        };
      },
      invalidatesTags: [{ type: 'Sample', id: 'LIST' }],
    }),
    updateSample: builder.mutation<
      ISampleListItem,
      { uuid: string; body: Partial<ISampleUpdatePayload> }
    >({
      query: ({ uuid, body }) => {
        const instrument = body.instrument?.id
          ? body.instrument?.id.split('|')
            ? body.instrument?.id.split('|')[0].trim()
            : body.instrument?.id
          : null;

        return {
          url: `samples/${uuid}/`,
          method: 'PUT',
          body: {
            ...body,
            samplingPlan: body.samplingPlan,
            medium: body.medium?.id,
            instrument: instrument,
            calibratedWith: body.calibratedWith?.id,
          },
        };
      },
      invalidatesTags: (arg) => [{ type: 'Sample', id: arg?.id }],
    }),
    getAllTwaCalculations: builder.query<
      DjangoRestFrameworkResult<{ id: string; title: string }>,
      unknown
    >({
      query: () => `twa-calculations/`,
    }),
    getAllHazards: builder.query<
      DjangoRestFrameworkResult<{
        id: string;
        title: string;
        casNumber: string;
      }>,
      {
        hazardType?: string;
        searchTitle?: string;
      }
    >({
      query: ({ hazardType, searchTitle }) => {
        return {
          url: `hazards/`,
          params: {
            type: hazardType?.trim(),
            search: searchTitle,
          },
        };
      },
    }),
    registerLastCheckSample: builder.mutation<
      ILastChecked,
      Partial<{ sample: string }>
    >({
      query: (body) => {
        return {
          url: `sample-checkins/`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Sample', id: arg?.sample }],
    }),
    finishSample: builder.mutation<
      ISample,
      {
        uuid: string;
        body: Partial<{ endTime: string; finalFlowRate: number }>;
      }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `samples/${uuid}/stop/`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Sample', id: arg?.id }],
    }),
    stopSample: builder.mutation<
      ISample,
      {
        uuid: string;
        body: Partial<{ endTime: string }>;
      }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `samples/${uuid}/stop/`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Sample', id: arg?.id }],
    }),
    startSample: builder.mutation<
      ISample,
      {
        uuid: string;
        body: Partial<{ startTime: string }>;
      }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `samples/${uuid}/start/`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Sample', id: arg?.id }],
    }),
    resultsSample: builder.mutation<
      ISampleResultResponse,
      { uuid: string; body: Partial<IResultsPayload> }
    >({
      query: ({ body }) => {
        if (body.sampleType === 'noise') {
          return {
            url: `noise-analysis-results/`,
            method: 'POST',
            body: body,
          };
        } else {
          return {
            url: `chemical-analysis-results/`,
            method: 'POST',
            body: body,
          };
        }
      },
      invalidatesTags: (result, _meta, arg) => [
        { type: 'Sample', id: result?.sample },
        { type: 'Sample', id: arg?.uuid },
        { type: 'Sample', id: 'LIST' },
      ],
    }),
    updateNoiseResult: builder.mutation<
      INoiseResult,
      { uuid: string; body: Partial<INoiseResultPayload> }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `noise-analysis-results/${uuid}/`,
          method: 'PUT',
          body: body,
        };
      },
      invalidatesTags: (_result, _meta, arg) => [
        { type: 'Sample', id: arg?.body.sample },
        { type: 'Sample', id: arg?.uuid },
        { type: 'Sample', id: 'LIST' },
      ],
    }),
    updateChemicalResult: builder.mutation<
      IChemicalResult,
      { uuid: string; body: Partial<IChemicalResult> }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `chemical-analysis-results/${uuid}/`,
          method: 'PUT',
          body: body,
        };
      },
      invalidatesTags: (_result, _meta, arg) => [
        { type: 'Sample', id: arg?.body.sample },
        { type: 'Sample', id: arg?.uuid },
        { type: 'Sample', id: 'LIST' },
      ],
    }),
    createChemicalResult: builder.mutation<
      IChemicalResult,
      Partial<IChemicalResult>
    >({
      query: (body) => {
        return {
          url: `chemical-analysis-results/`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: (_result, _meta, arg) => [
        { type: 'Sample', id: arg?.sample },
        { type: 'Sample', id: 'LIST' },
      ],
    }),
    createNoiseResult: builder.mutation<
      INoiseResult,
      Partial<INoiseResultPayload>
    >({
      query: (body) => {
        return {
          url: `noise-analysis-results/`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: (_result, _meta, arg) => [
        { type: 'Sample', id: arg?.sample },
        { type: 'Sample', id: 'LIST' },
      ],
    }),
    getSampleResultById: builder.query<
      DjangoRestFrameworkResult<
        ISampleResultListItem | ISampleResultNoiseListItem
      >,
      { uuid?: string; type?: string }
    >({
      query: ({ uuid, type }) => {
        if (type === 'chemical') {
          return {
            url: `chemical-analysis-results/`,
            params: {
              sample: uuid,
            },
          };
        }

        return {
          url: `noise-analysis-results/`,
          params: {
            sample: uuid,
          },
        };
      },
      providesTags: () => [{ type: 'Sample', id: 'LIST' }],
    }),
    getNoiseResultById: builder.query<INoiseResult, string>({
      query: (uuid) => {
        return {
          url: `noise-analysis-results/`,
          params: {
            sample: uuid,
          },
        };
      },
      transformResponse: (
        response: DjangoRestFrameworkResult<INoiseResult>,
      ) => {
        return response.results[0];
      },
      providesTags: (arg) => [{ type: 'Sample', id: arg?.id }],
    }),
    getChemicalResultById: builder.query<IChemicalResult[], string>({
      query: (uuid) => {
        return {
          url: `chemical-analysis-results/`,
          params: {
            sample: uuid,
          },
        };
      },
      transformResponse: (
        response: DjangoRestFrameworkResult<IChemicalResult>,
      ) => {
        return response.results;
      },
      providesTags: (result) =>
        result && result
          ? [
              ...result.map(({ id }) => ({
                type: 'Sample' as const,
                id: id,
              })),
            ]
          : [{ type: 'Sample', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllSamplesQuery,
  useGetAllSamplesBySurveyMomentQuery,
  useCreateSampleMutation,
  useGetSampleByIdQuery,
  useGetAllTwaCalculationsQuery,
  useGetAllHazardsQuery,
  useRegisterLastCheckSampleMutation,
  useUpdateSampleMutation,
  useFinishSampleMutation,
  useStopSampleMutation,
  useStartSampleMutation,
  useResultsSampleMutation,
  useUpdateChemicalResultMutation,
  useCreateChemicalResultMutation,
  useCreateNoiseResultMutation,
  useUpdateNoiseResultMutation,
  useGetSampleResultByIdQuery,
  useGetNoiseResultByIdQuery,
  useGetChemicalResultByIdQuery,
} = SampleApi;
