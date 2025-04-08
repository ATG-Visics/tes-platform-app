import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';

export interface IAreaSubjectListItem {
  id: string;
  workEnvironment: string;
  ventilation: string;
  weldingProcess: string;
  metal: string;
  electrode: string;
  samplingConditions: string;
  unusualConditions: string;
  title: string;
  taskDescription: string;
  chemicals: boolean;
  surveyMoment: {
    project: string;
    startDate: string;
  };
}

export interface IAreaSampleSubject {
  id: string;
  workEnvironment: {
    id: string;
    title: string;
  };
  ventilation: {
    id: string;
    title: string;
  };
  weldingProcess: {
    id: string;
    title: string;
  };
  metal: {
    id: string;
    title: string;
  };
  electrode: {
    id: string;
    title: string;
  };
  samplingConditions: {
    id: string;
    title: string;
  };
  unusualConditions: {
    id: string;
    title: string;
  };
  title: string;
  taskDescription: string;
  jobTitle: string;
  chemicals: boolean;
  samplingPlan: string;
  surveyMoment: {
    project: string;
    startDate: string;
  };
}

export interface IAreaSampleSubjectPayload {
  title: string;
  taskDescription: string;
  chemicals: boolean;
  workEnvironment: string;
  ventilation: string;
  weldingProcess: string;
  metal: string;
  electrode: string;
  samplingConditions: string;
  unusualConditions: string;
  surveyMoment: {
    project: string;
    startDate: string;
  };
  whichSubject?: string;
  samplingPlan: string | null;
  useSamplingPlan: string;
}

export const AreaSubjectApi = createApi({
  reducerPath: 'AreaSubjectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as {
        authentication: AuthenticationState;
      };
      const accessToken = state['authentication'].accessToken;
      headers.set('Authorization', `Bearer ${accessToken}`);
      return headers;
    },
  }),
  tagTypes: ['AreaSubject'],
  endpoints: (builder) => ({
    createAreaSampleSubject: builder.mutation<
      IAreaSampleSubject,
      Partial<IAreaSampleSubjectPayload>
    >({
      query: (params) => {
        return {
          url: 'area-sample-subjects/',
          method: 'POST',
          body: params,
        };
      },
      invalidatesTags: () => [{ type: 'AreaSubject' }],
    }),
    getAllAreaSampleSubject: builder.query<
      DjangoRestFrameworkResult<IAreaSubjectListItem>,
      {
        surveyMomentId: {
          project: string;
          startDate: string;
        };
      }
    >({
      query: ({ surveyMomentId }) => {
        return {
          url: `area-sample-subjects/`,
          params: {
            survey_moment__start_date: surveyMomentId.startDate,
            survey_moment__project: surveyMomentId.project,
          },
        };
      },
      providesTags: () => [{ type: 'AreaSubject', id: 'List' }],
    }),
    updateAreaSampleSubject: builder.mutation<
      IAreaSampleSubject,
      { uuid: string; body: Partial<IAreaSampleSubjectPayload> }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `area-sample-subjects/${uuid}/`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (arg) => [
        { type: 'AreaSubject', id: arg?.id },
        { type: 'AreaSubject', id: 'List' },
      ],
    }),
    getAreaSubjectById: builder.query<IAreaSampleSubject, string>({
      query: (uuid) => `area-sample-subjects/${uuid}/`,
      providesTags: (arg) => [{ type: 'AreaSubject', id: arg?.id }],
    }),
    downloadAreaSubjectPDFStarter: builder.mutation<
      { taskId: string; status: string },
      string
    >({
      query: (uuid) => {
        return {
          url: `area-sample-subjects/${uuid}/export_pdf/`,
          method: 'GET',
        };
      },
    }),
    downloadAreaSubjectPDFStatus: builder.query<
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
          url: `area-sample-subjects/${uuid}/export_pdf_status/?task_id=${taskId}`,
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
  useGetAllAreaSampleSubjectQuery,
  useGetAreaSubjectByIdQuery,
  useCreateAreaSampleSubjectMutation,
  useUpdateAreaSampleSubjectMutation,
  useDownloadAreaSubjectPDFStatusQuery,
  useDownloadAreaSubjectPDFStarterMutation,
} = AreaSubjectApi;
