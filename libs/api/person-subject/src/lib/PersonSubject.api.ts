import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';

export interface IPersonSampleSubjectListItem {
  id: string;
  surveyMoment: {
    startDate: string;
    project: string;
  };
  title: string;
  taskDescription: string;
  chemicals: boolean;
  shift: string;
  shiftLength: number;
  segOther: string;
  jobTitle: string;
  workEnvironment: string;
  ventilation: string;
  weldingProcess: string;
  metal: string;
  electrode: string;
  samplingConditions: string;
  unusualConditions: string;
  exposureControls: string;
  clothing: string;
  respirator: string;
  respiratorFilters: string;
  gloves: string;
  boots: string;
  eyeWear: string;
  hearingProtection: string;
  noiseReductionRating: string;
  headProtection: string;
  seg: string;
  employeeNumber: string;
}

export interface IPersonSampleSubject {
  id: string;
  surveyMoment: {
    startDate: string;
    project: string;
  };
  title: string;
  taskDescription: string;
  chemicals: boolean;
  shift: string;
  shiftLength: number;
  segOther: string;
  jobTitle: string;
  samplingPlan: string;
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
  exposureControls: {
    id: string;
    title: string;
  };
  exposureControlsOther: string;
  clothing: {
    id: string;
    title: string;
  }[];
  clothingOther: string;
  respirator: {
    id: string;
    title: string;
  }[];
  respiratorFilters: string;
  gloves: {
    id: string;
    title: string;
  }[];
  glovesOther: string;
  boots: {
    id: string;
    title: string;
  }[];
  bootsOther: string;
  eyeWear: {
    id: string;
    title: string;
  }[];
  eyeWearOther: string;
  hearingProtection: {
    id: string;
    title: string;
  }[];
  hearingProtectionOther: string;
  noiseReductionRating: string;
  headProtection: {
    id: string;
    title: string;
  }[];
  headProtectionOther: string;
  seg: {
    id: string;
    title: string;
  };
  employeeNumber: string;
  employeeName: string;
}

export interface IPersonSampleSubjectPayload {
  surveyMoment: {
    startDate: string;
    project: string;
  };
  title: string;
  taskDescription: string;
  chemicals: boolean;
  shift: string;
  shiftLength: number;
  segOther: string;
  jobTitle: string;
  workEnvironment: string;
  ventilation: string;
  weldingProcess: string;
  metal: string;
  electrode: string;
  samplingConditions: string;
  unusualConditions: string;
  exposureControls: string;
  clothing: string[];
  respirator: string[];
  respiratorFilters: string;
  gloves: string[];
  boots: string[];
  eyeWear: string[];
  hearingProtection: string[];
  noiseReductionRating: string;
  headProtection: string[];
  seg: { id: string; title: string };
  employeeNumber: string;
  whichSubject: string;
  samplingPlan: string | null;
  useSamplingPlan: string;
  hasSamples: boolean;
}

export const PersonSubjectApi = createApi({
  reducerPath: 'PersonSubjectApi',
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
  tagTypes: ['PersonSubject'],
  endpoints: (builder) => ({
    createPersonSampleSubject: builder.mutation<
      IPersonSampleSubject,
      Partial<IPersonSampleSubjectPayload>
    >({
      query: (body) => {
        return {
          url: `person-sample-subjects/`,
          method: 'POST',
          body: {
            ...body,
            seg: body.seg?.id,
          },
        };
      },
      invalidatesTags: () => [{ type: 'PersonSubject' }],
    }),
    updatePersonSampleSubject: builder.mutation<
      IPersonSampleSubject,
      { uuid: string; body: IPersonSampleSubjectPayload }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `person-sample-subjects/${uuid}/`,
          method: 'PUT',
          body: {
            ...body,
            seg: body.seg?.id,
          },
        };
      },
      invalidatesTags: (arg) => [
        { type: 'PersonSubject', id: arg?.id },
        { type: 'PersonSubject', id: 'LIST' },
      ],
    }),
    getAllPersonSampleSubject: builder.query<
      DjangoRestFrameworkResult<IPersonSampleSubjectListItem>,
      {
        surveyMomentId: {
          project: string;
          startDate: string;
        };
      }
    >({
      query: ({ surveyMomentId }) => {
        return {
          url: `person-sample-subjects/`,
          params: {
            survey_moment__start_date: surveyMomentId.startDate,
            survey_moment__project: surveyMomentId.project,
          },
        };
      },
      providesTags: () => [{ type: 'PersonSubject', id: 'LIST' }],
    }),
    getPersonSubjectById: builder.query<IPersonSampleSubject, string>({
      query: (uuid) => `person-sample-subjects/${uuid}/`,
      providesTags: (arg) => [{ type: 'PersonSubject', id: arg?.id }],
    }),
    downloadPersonSubjectPDFStarter: builder.mutation<
      { taskId: string; status: string },
      string
    >({
      query: (uuid) => {
        return {
          url: `person-sample-subjects/${uuid}/export_pdf/`,
          method: 'GET',
        };
      },
    }),
    downloadPersonSubjectPDFStatus: builder.query<
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
          url: `person-sample-subjects/${uuid}/export_pdf_status/?task_id=${taskId}`,
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
  useCreatePersonSampleSubjectMutation,
  useUpdatePersonSampleSubjectMutation,
  useGetAllPersonSampleSubjectQuery,
  useGetPersonSubjectByIdQuery,
  useDownloadPersonSubjectPDFStatusQuery,
  useDownloadPersonSubjectPDFStarterMutation,
} = PersonSubjectApi;
