import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { OrderDirection } from '../client.slice';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';
import { AccountsState } from '@tes/accounts';

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

export interface IClientProjectItem {
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
  locations: Array<string>;
  updatedAt: string;
}

interface IClientsPayload {
  page: number;
  limit: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
  filterParams: { [key: string]: string };
}

interface ICreateClientPayload {
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
}

interface IClientProject {
  uuid: string;
}

export const ClientApi = createApi({
  reducerPath: 'ClientApi',
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
  tagTypes: ['Clients'],
  endpoints: (builder) => ({
    getAllClients: builder.query<
      DjangoRestFrameworkResult<IClient>,
      Partial<IClientsPayload>
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
          url: 'clients/',
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
                type: 'Clients' as const,
                id,
              })),
              { type: 'Clients', id: 'LIST' },
            ]
          : [{ type: 'Clients', id: 'LIST' }],
    }),
    getAllClientProjects: builder.query<
      DjangoRestFrameworkResult<IClientProjectItem>,
      IClientProject
    >({
      query: ({ uuid }) => `projects/?client=${uuid}`,
    }),
    getClientById: builder.query<IClient, string>({
      query: (uuid) => `/clients/${uuid}/`,
      providesTags: (arg) => [{ type: 'Clients', id: arg?.id }],
    }),
    updateClient: builder.mutation<
      IClient,
      { uuid: string; body: Partial<IClient> }
    >({
      query: (params) => {
        const { uuid, body } = params;
        return {
          url: `clients/${uuid}/`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Clients', id: arg?.id }],
    }),
    createClient: builder.mutation<IClient, Partial<ICreateClientPayload>>({
      query: (params) => {
        return {
          url: `clients/`,
          method: 'POST',
          body: params,
        };
      },
      invalidatesTags: [{ type: 'Clients', id: 'LIST' }],
    }),
    deleteClient: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => {
        return {
          url: `/clients/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [{ type: 'Clients', id: 'LIST' }],
    }),
    sendClientInvite: builder.mutation<IClient, string>({
      query: (uuid) => {
        return {
          url: `/clients/${uuid}/invite/`,
          method: 'POST',
          body: { uuid },
        };
      },
    }),
  }),
});

export const {
  useGetAllClientsQuery,
  useGetAllClientProjectsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useSendClientInviteMutation,
} = ClientApi;
