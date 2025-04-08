import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { AccountsState } from '@tes/accounts';
import { AuthenticationState } from '@tes/authentication';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { OrderDirection } from '../platform.slice';

export interface IClient {
  id: string;
  title: string;
  contactPerson: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  updatedAt: string;
  account: string;
}

interface IResultsByHazard {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface IResultsByClient {
  id: string;
  title: string;
  results: Array<{
    id: string;
    label: string;
    value: number;
    color: string;
  }>;
}

export interface IResultByCategory {
  id: string;
  sampleId: string;
  sampleTitle: string;
  sampleType: string;
  hazard: string;
  project: string;
  projectId: string;
  surveyMoment: {
    project: string;
    startDate: string;
  };
}

interface IResultCategoryPayload {
  page: number;
  limit: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const dashboardApi = createApi({
  reducerPath: 'DashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as {
        authentication: AuthenticationState;
        accounts: AccountsState;
      };
      const accountToken = state['accounts'].accountId;
      headers.set('account', `${accountToken}`);
      headers.set(
        'Authorization',
        `Bearer ${state['authentication'].accessToken}`,
      );
      return headers;
    },
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getAllHazards: builder.query<
      Array<{
        id: string;
        title: string;
        casNumber: string;
      }>,
      {
        hazardType?: string;
        searchTitle?: string;
      }
    >({
      query: ({ searchTitle }) => {
        return {
          url: `dashboard/hazards-with-results/`,
          params: {
            search: searchTitle,
          },
        };
      },
    }),
    getAllClients: builder.query<DjangoRestFrameworkResult<IClient>, void>({
      query: () => {
        return {
          url: `clients/`,
        };
      },
    }),
    getResultsByHazard: builder.query<
      Array<IResultsByHazard>,
      {
        hazard: string | null;
        filters: { clients: Array<string>; sampleType: Array<string> };
        startDate: string;
        endDate: string;
      }
    >({
      query: ({ hazard, filters, startDate, endDate }) => {
        return {
          url: `dashboard/oel-groups-by-hazard/${hazard}/`,
          params: {
            client: filters.clients.join(','),
            sample_type: filters.sampleType.join(','),
            start_date: startDate,
            end_date: endDate,
          },
        };
      },
    }),
    getClientsByHazard: builder.query<
      Array<{ id: string; title: string }>,
      string | null
    >({
      query: (hazardId) => {
        return {
          url: `dashboard/clients-with-hazard/${hazardId}/`,
        };
      },
    }),
    getAllResultsByClient: builder.query<
      Array<IResultsByClient>,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => {
        return {
          url: `dashboard/oel-groups/`,
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        };
      },
    }),
    getOneResultByCategory: builder.query<
      DjangoRestFrameworkResult<IResultByCategory>,
      Partial<
        IResultCategoryPayload & {
          client: string;
          category: string;
          hazard: string;
        }
      >
    >({
      query: (params) => {
        const {
          page = 0,
          limit = 10,
          orderBy = '',
          orderDirection = OrderDirection.ASC,
          search,
          client,
          category,
          hazard,
        } = params || {};

        let ordering = '';
        if (orderBy !== '') {
          ordering = orderBy;

          if (orderDirection === OrderDirection.DESC) {
            ordering = `-${ordering}`;
          }
        }

        if (hazard) {
          return {
            url: `dashboard/oel-groups-by-hazard/${hazard}/${category}/`,
            params: {
              search,
              limit: limit,
              ordering,
              offset: page * limit,
            },
          };
        }

        return {
          url: `dashboard/oel-groups/${client}/${category}/`,
          params: {
            search,
            limit: limit,
            ordering,
            offset: page * limit,
          },
        };
      },
    }),
    getProjectResultsOverview: builder.query<
      DjangoRestFrameworkResult<{ id: string; title: string; count: number }>,
      Partial<IResultCategoryPayload>
    >({
      query: (params) => {
        const { page = 0, limit = 10, search } = params || {};

        return {
          url: `dashboard/project-results-overview/`,
          params: {
            search,
            limit: limit,
            offset: page * limit,
          },
        };
      },
    }),
  }),
});

export const {
  useGetOneResultByCategoryQuery,
  useGetAllHazardsQuery,
  useGetResultsByHazardQuery,
  useGetAllResultsByClientQuery,
  useGetAllClientsQuery,
  useGetClientsByHazardQuery,
  useGetProjectResultsOverviewQuery,
} = dashboardApi;
