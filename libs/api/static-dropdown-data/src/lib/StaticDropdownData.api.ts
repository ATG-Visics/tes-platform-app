import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

interface IReadData {
  id: string;
  title: string;
}

export const StaticDropdownDataApi = createApi({
  reducerPath: 'StaticDropdownData',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as {
        authentication: AuthenticationState;
        accounts: AccountsState;
      };
      const accessToken = state['authentication'].accessToken;
      headers.set('Authorization', `Bearer ${accessToken}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllMetal: builder.query<DjangoRestFrameworkResult<IReadData>, unknown>({
      query: () => `metals/`,
    }),
    getAllWorkEnvironments: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () => `work-environments/`,
    }),
    getAllVentilations: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () => `ventilations/`,
    }),
    getAllWeldingProcesses: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () => `welding-processes/`,
    }),
    getAllSamplingConditions: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () => `sampling-conditions/`,
    }),
    getAllUnusualConditions: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () => `unusual-conditions/`,
    }),
    getAllSeg: builder.query<
      DjangoRestFrameworkResult<IReadData>,
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
    getAllExposureControls: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () => `exposure-controls/`,
    }),
    getAllClothing: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () =>
        `personal-protective-equipment/?protection_type__slug=clothing`,
    }),
    getAllGloves: builder.query<DjangoRestFrameworkResult<IReadData>, unknown>({
      query: () =>
        `personal-protective-equipment/?protection_type__slug=gloves`,
    }),
    getAllBoots: builder.query<DjangoRestFrameworkResult<IReadData>, unknown>({
      query: () => `personal-protective-equipment/?protection_type__slug=boots`,
    }),
    getAllEyeWear: builder.query<DjangoRestFrameworkResult<IReadData>, unknown>(
      {
        query: () =>
          `personal-protective-equipment/?protection_type__slug=eyewear`,
      },
    ),
    getAllHeadProtection: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () =>
        `personal-protective-equipment/?protection_type__slug=head-protection`,
    }),
    getAllHearingProtection: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () =>
        `personal-protective-equipment/?protection_type__slug=hearing-protection`,
    }),
    getAllRespirator: builder.query<
      DjangoRestFrameworkResult<IReadData>,
      unknown
    >({
      query: () =>
        `personal-protective-equipment/?protection_type__slug=respirator`,
    }),
  }),
});

export const {
  useGetAllMetalQuery,
  useGetAllWorkEnvironmentsQuery,
  useGetAllVentilationsQuery,
  useGetAllWeldingProcessesQuery,
  useGetAllSamplingConditionsQuery,
  useGetAllUnusualConditionsQuery,
  useGetAllSegQuery,
  useGetAllExposureControlsQuery,
  useGetAllClothingQuery,
  useGetAllGlovesQuery,
  useGetAllBootsQuery,
  useGetAllEyeWearQuery,
  useGetAllHeadProtectionQuery,
  useGetAllHearingProtectionQuery,
  useGetAllRespiratorQuery,
} = StaticDropdownDataApi;
