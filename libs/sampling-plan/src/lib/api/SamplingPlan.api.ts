import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { OrderDirection } from '../sampling-plan.slice';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

interface IHazard {
  casNumber: string;
  id: string;
  title: string;
}

interface IHazardScenario {
  hazard: IHazard;
  oel: string;
  oelSource: { id: string; title: string };
  unit: { id: string; title: string };
  analyticalMethod: string;
  targetSampleCount: number;
  remainingSampleCount: number;
  sampleCount: number;
  selected?: boolean;
  actionLevel?: string;
  actionLevelSource?: { id: string; title: string };
}

interface ISeg {
  id: string;
  title: string;
}

interface IJobTitle {
  id: string;
  jobTitle: string;
  shiftLength: string;
}

export interface IQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
  filterParams: { [key: string]: string };
  project: string;
}

// What is returned from the API on list or create / update.
export interface ISamplingPlanListResponse {
  id: string;
  project: string;
  title: string;
  seg: ISeg;
  jobTitle: string;
  targetSampleCount: number;
  hazardScenarios: IHazardScenario[];
  recentActivity: string;
  updatedAt: string;
  createdAt: string;
  sampleType: string;
  media: { id: string; title: string };
  taskDescription?: string;
  calibratedWith: string;
  instrument: string;
  maximumAcceptableFlowRate: string;
  minimumAcceptableFlowRate: string;
  minimumVolume: string;
  shiftLength: number;
  subjectType: string;
  analyticalMethod?: string;
}

interface IProject {
  id: string;
}

// What is returned from the API on get by id.
export interface ISamplingPlanResponse {
  id: string;
  project: IProject;
  title: string;
  jobTitle: string;
  targetSampleCount: number;
  hazards: IHazard[];
  hazardScenario: IHazardScenario[];
  recentActivity: string;
  updatedAt: string;
  createdAt: string;
  analyticalMethod?: string;
  sampleType: string;
  media: { id: string; title: string };
}

// Body for create / update
export interface ISamplingPlanPayload {
  id?: string;
  title: string;
  project: { id: string; title: string };
  projectId: string;
  seg?: { id: string; title: string };
  jobTitle?: string;
  shiftLength?: number;
  sampleType: string;
  taskDescription?: string;
  hazardScenarios?: Array<IHazardScenario>;
  targetSampleCount: number;
  oel: string;
  media: { id: string; title: string };
  medium: { id: string; title: string };
  analyticalMethod?: string;
  minimumAcceptableFlowRate?: string;
  maximumAcceptableFlowRate?: string;
  minimumVolume?: string;
  chemical?: boolean;
}

export interface ISamplingPlanUpload {
  id: string;
  createdAt: string;
  document: string;
  documentHash: string;
}

export interface ISamplingPlanUploadPayload {
  document: File;
  project: string;
}

interface SamplingPlanChartResponse {
  countsByMonth: Array<{
    date: string;
    count: number;
  }>;
  targetSampleCount: number;
  currentSampleCount: number;
}

export const SamplingPlanApi = createApi({
  reducerPath: 'SamplingPlanApi',
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
  tagTypes: ['SamplingPlans'],
  endpoints: (builder) => ({
    getAllSamplingPlans: builder.query<
      DjangoRestFrameworkResult<ISamplingPlanListResponse>,
      Partial<IQueryParams>
    >({
      query: (params) => {
        const {
          page = 0,
          limit = 10,
          orderBy = '',
          orderDirection = OrderDirection.ASC,
          search,
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
          url: 'sampling-plans/',
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
      providesTags: (result) =>
        result && result.results
          ? [
              ...result.results.map(({ id }) => ({
                type: 'SamplingPlans' as const,
                id,
              })),
              { type: 'SamplingPlans', id: 'LIST' },
            ]
          : [{ type: 'SamplingPlans', id: 'LIST' }],
    }),
    getSamplingPlanById: builder.query<ISamplingPlanListResponse, string>({
      query: (uuid) => `/sampling-plans/${uuid}/`,
      providesTags: (arg) => [
        { type: 'SamplingPlans', id: arg?.id },
        { type: 'SamplingPlans', id: 'DETAIL' },
      ],
    }),
    getSamplingPlanChartData: builder.query<SamplingPlanChartResponse, string>({
      query: (projectId) => `sampling-plans/sample-history/${projectId}`,
      providesTags: [{ type: 'SamplingPlans', id: 'CHART' }],
    }),
    createSamplingPlan: builder.mutation<
      ISamplingPlanListResponse,
      Partial<ISamplingPlanPayload>
    >({
      query: (body) => {
        const payload = {
          ...body,
          media: body.media?.id,
          project: body.project?.id,
        };
        return {
          url: 'sampling-plans/',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: [
        { type: 'SamplingPlans', id: 'LIST' },
        { type: 'SamplingPlans', id: 'CHART' },
      ],
    }),
    updateSamplingPlan: builder.mutation<
      ISamplingPlanListResponse,
      { uuid: string; body: Partial<ISamplingPlanPayload> }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `sampling-plans/${uuid}/`,
          method: 'PUT',
          body: {
            ...body,
            project: body.project?.id,
            media: body.media?.id,
          },
        };
      },
      invalidatesTags: (arg) => [
        { type: 'SamplingPlans', id: arg?.id },
        { type: 'SamplingPlans', id: 'CHART' },
      ],
    }),
    deleteSamplingPlan: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query(id) {
        return {
          url: `/sampling-plans/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [
        { type: 'SamplingPlans', id: 'LIST' },
        { type: 'SamplingPlans', id: 'CHART' },
      ],
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
    getAllSeg: builder.query<
      DjangoRestFrameworkResult<ISeg>,
      { searchTitle?: string }
    >({
      query: ({ searchTitle }) => {
        return {
          url: `segs/`,
          params: {
            search: searchTitle,
          },
        };
      },
    }),
    getAllJobTitles: builder.query<
      DjangoRestFrameworkResult<IJobTitle>,
      Partial<IQueryParams>
    >({
      query: (params) => {
        const {
          page = 0,
          limit = 10,
          orderBy = '',
          orderDirection = OrderDirection.ASC,
          search,
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
          url: `sampling-plans/job-titles/${project}/`,
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
    downloadSamplingPlan: builder.mutation<
      null,
      { projectID: string; downloadTitle: string }
    >({
      queryFn: async (
        { projectID, downloadTitle },
        _api,
        _extraOptions,
        baseQuery,
      ) => {
        const result = await baseQuery({
          url: `sampling-plans/export/${projectID}`,
          responseHandler: (response) => response.blob(),
        });
        const hiddenElement = document.createElement('a');
        const url = window.URL || window.webkitURL;
        const blobExcel = url.createObjectURL(result.data as Blob);
        hiddenElement.href = blobExcel;
        hiddenElement.target = '_blank';
        hiddenElement.download = `Sample plan: ${downloadTitle}`;
        hiddenElement.click();
        return { data: null };
      },
    }),
    createSamplingPlanUpload: builder.mutation<
      ISamplingPlanUpload,
      ISamplingPlanUploadPayload
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append('project', body.project);
        formData.append('samplePlan', body.document);
        return {
          url: 'sampling-plans/import/',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [
        { type: 'SamplingPlans', id: 'LIST' },
        { type: 'SamplingPlans', id: 'CHART' },
      ],
    }),
  }),
});

export const {
  useGetAllSamplingPlansQuery,
  useGetSamplingPlanByIdQuery,
  useGetAllHazardsQuery,
  useGetAllSampleMediaStaticQuery,
  useGetAllSegQuery,
  useCreateSamplingPlanMutation,
  useUpdateSamplingPlanMutation,
  useDeleteSamplingPlanMutation,
  useDownloadSamplingPlanMutation,
  useCreateSamplingPlanUploadMutation,
  useGetSamplingPlanChartDataQuery,
  useGetAllJobTitlesQuery,
} = SamplingPlanApi;
