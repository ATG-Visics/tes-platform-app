import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';

export interface IMessageLog {
  id: string;
  author: {
    id: number;
    username: string;
    getFullName: string;
  };
  surveyMoment: string;
  message: string | null;
  file: {
    file: string;
    url: string;
    mimetype: string;
    name: string;
  };
  createdAt: string;
  mentionedSamples: { id: string; sampleId: string }[];
  mentionedPersonSampleSubjects: { id: string; title: string }[];
  mentionedAreaSampleSubjects: { id: string; title: string }[];
}

export interface IMessageLogPayload {
  author: string | number;
  surveyMoment: {
    project: string;
    startDate: string;
  };
  message: string;
}

interface IMessageLogfile {
  file: {
    file: string;
    url: string;
    mimetype: string;
  };
}

export interface IMessageLogFilePayload {
  author: string | number;
  surveyMoment: {
    project: string;
    startDate: string;
  };
  file: File;
}

export const messageLogApi = createApi({
  reducerPath: 'MessageLogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as { authentication: AuthenticationState };
      const accessToken = state['authentication'].accessToken;
      headers.set('Authorization', `Bearer ${accessToken}`);
      return headers;
    },
    headers: { 'content-type': 'multipart/form-data' },
  }),
  tagTypes: ['MessageLog'],
  endpoints: (builder) => ({
    getAllMessageLog: builder.query<
      DjangoRestFrameworkResult<IMessageLog>,
      {
        surveyMomentId: {
          project: string;
          startDate: string;
        };
      }
    >({
      query: ({ surveyMomentId }) => {
        return {
          url: `log-messages/`,
          params: {
            survey_moment__start_date: surveyMomentId.startDate,
            survey_moment__project: surveyMomentId.project,
          },
        };
      },
      providesTags: [{ type: 'MessageLog', id: 'LIST' }],
    }),
    createMessageLog: builder.mutation<
      IMessageLog,
      Partial<IMessageLogPayload>
    >({
      query: (body) => {
        return {
          url: `log-messages/`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: [{ type: 'MessageLog', id: 'LIST' }],
    }),
    updateMessageLog: builder.mutation<
      IMessageLog,
      { uuid: string; newMessage: string }
    >({
      query: ({ uuid, newMessage }) => {
        return {
          url: `log-messages/${uuid}/`,
          method: 'PATCH',
          body: { message: newMessage },
        };
      },
      invalidatesTags: [{ type: 'MessageLog', id: 'LIST' }],
    }),
    createMessageLogFile: builder.mutation<
      IMessageLogfile,
      IMessageLogFilePayload
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append('file', body.file);
        formData.append('author', `${body.author}`);
        formData.append(
          'survey_moment.start_date',
          body.surveyMoment.startDate,
        );
        formData.append('survey_moment.project', body.surveyMoment.project);

        return {
          url: `log-message-files/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'MessageLog', id: 'LIST' }],
    }),
    downloadLogMessagesPDFStarter: builder.mutation<
      { taskId: string; status: string },
      { project: string; startDate: string }
    >({
      query: ({ project, startDate }) => {
        return {
          url: `log-messages/export_pdf/?project=${project}&startDate=${startDate}`,
          method: 'GET',
        };
      },
    }),
    downloadLogMessagesPDFStatus: builder.query<
      unknown,
      { taskId: string; fileName: string }
    >({
      queryFn: async ({ taskId, fileName }, _api, _extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: `log-messages/export_pdf_status/?task_id=${taskId}`,
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
  useGetAllMessageLogQuery,
  useCreateMessageLogMutation,
  useUpdateMessageLogMutation,
  useCreateMessageLogFileMutation,
  useDownloadLogMessagesPDFStarterMutation,
  useDownloadLogMessagesPDFStatusQuery,
} = messageLogApi;
