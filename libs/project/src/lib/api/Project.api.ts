import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { OrderDirection } from '../project.slice';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { IClient } from '@tes/client';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

export interface IProjectListItem {
  id: string;
  title: string;
  client: {
    id: string;
    title: string;
  };
  jobNumber: string;
  startDate: string;
  endDate: string;
  description: string;
  updatedAt: string;
}

export interface IProject {
  id: string;
  title: string;
  client: IClient;
  jobNumber: string;
  startDate: string;
  endDate: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  floorPlan: string | null;
}

interface IProjectPayload {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  search: string;
  filterParams?: { [key: string]: string };
}

export interface ICreateProjectPayload {
  id: string;
  title: string;
  client: string;
  jobNumber: string;
  startDate: string;
  endDate: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  floorPlan: string | null;
  questionGroups: Array<string>;
  dynamicGroup: Array<string>;
  staticGroup: Array<string>;
  addressSameAs: boolean;
  contactSameAs: boolean;
}

export interface IProjectForm {
  id: string;
  title: string;
  client: string;
  jobNumber: string;
  startDate: string;
  endDate: string;
  description: string;
  floorPlan: string | null;
  addressSameAs: boolean;
}

export const ProjectApi = createApi({
  reducerPath: 'ProjectApi',
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
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    getAllProjects: builder.query<
      DjangoRestFrameworkResult<IProjectListItem>,
      IProjectPayload
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
          url: 'projects/',
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
                type: 'Projects' as const,
                id,
              })),
              { type: 'Projects', id: 'LIST' },
            ]
          : [{ type: 'Projects', id: 'LIST' }],
    }),
    getProjectById: builder.query<IProject, string>({
      query: (uuid) => `/projects/${uuid}/`,
      providesTags: (arg) => [{ type: 'Projects', id: arg?.id }],
    }),
    updateProject: builder.mutation<
      IProject,
      { uuid: string; body: Partial<ICreateProjectPayload> }
    >({
      query: (params) => {
        const { uuid, body } = params;
        return {
          url: `projects/${uuid}/`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Projects', id: arg?.id }],
    }),
    createProject: builder.mutation<IProject, Partial<ICreateProjectPayload>>({
      query: (params) => {
        return {
          url: `projects/`,
          method: 'POST',
          body: { ...params, locations: [] },
        };
      },
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    deleteProject: builder.mutation<{ success: boolean; id: string }, string>({
      query(id) {
        return {
          url: `/projects/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    downloadExcelFileStarter: builder.mutation<
      { taskId: string; status: string },
      string
    >({
      query: (id) => {
        return {
          url: `samples/export/?project=${id}`,
          method: 'GET',
        };
      },
    }),
    downloadExcelFileStatus: builder.query<
      unknown,
      { taskId: string; fileName: string }
    >({
      queryFn: async ({ taskId, fileName }, _api, _extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: `samples/export_status/?task_id=${taskId}`,
        });

        const result = response as unknown as {
          data: { status: string; downloadUrl: string };
        };

        if (result.data.status === 'completed') {
          const fileUrl = new URL(
            result?.data.downloadUrl || '',
          ).pathname.substring(8);
          const fileResponse = await baseQuery({
            url: `${fileUrl}`,
            responseHandler: (response) => response.blob(),
          });
          const hiddenElement = document.createElement('a');
          const url = window.URL || window.webkitURL;
          const blobExcel = new Blob([
            fileResponse.data as unknown as BlobPart,
          ]);

          const blobExcelUrl = url.createObjectURL(blobExcel);
          hiddenElement.href = blobExcelUrl;
          hiddenElement.target = '_blank';
          hiddenElement.download = `${fileName}.xlsx`;
          hiddenElement.click();
          window.URL.revokeObjectURL(blobExcelUrl);
        }

        return response;
      },
    }),
    downloadAllSubjectPDFStarter: builder.mutation<
      { taskId: string; status: string },
      { project: string; fromDate?: string; toDate?: string }
    >({
      query: ({ project, fromDate, toDate }) => {
        const params: Record<string, string> = {};
        if (fromDate) {
          params['fromDate'] = fromDate;
        }
        if (toDate) {
          params['toDate'] = toDate;
        }
        return {
          url: `projects/${project}/export_all_subjects/`,
          method: 'GET',
          params,
        };
      },
    }),
    downloadAllSubjectPDFStatus: builder.query<
      unknown,
      { taskId: string; uuid: string; fileName: string }
    >({
      queryFn: async (
        { taskId, uuid, fileName },
        _api,
        _extraOptions,
        baseQuery,
      ) => {
        const response = await baseQuery({
          url: `projects/${uuid}/export_all_subjects_status/?task_id=${taskId}`,
        });

        const result = response as unknown as {
          data: { status: string; downloadUrl: string };
        };

        if (result.data.status === 'completed') {
          const fileUrl = new URL(
            result?.data.downloadUrl || '',
          ).pathname.substring(8);
          const fileResponse = await baseQuery({
            url: `${fileUrl}`,
            responseHandler: (response) => response.blob(),
          });
          const hiddenElement = document.createElement('a');
          const url = window.URL || window.webkitURL;
          const blobPDF = new Blob([fileResponse.data as unknown as BlobPart], {
            type: 'application/pdf',
          });

          const blobPDFUrl = url.createObjectURL(blobPDF);
          hiddenElement.href = blobPDFUrl;
          hiddenElement.target = '_blank';
          hiddenElement.download = `${fileName}`;
          hiddenElement.click();
          window.URL.revokeObjectURL(blobPDFUrl);
        }

        return response;
      },
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useDownloadExcelFileStarterMutation,
  useDownloadExcelFileStatusQuery,
  useDownloadAllSubjectPDFStarterMutation,
  useDownloadAllSubjectPDFStatusQuery,
} = ProjectApi;
