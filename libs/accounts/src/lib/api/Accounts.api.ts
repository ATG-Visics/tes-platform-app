import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AccountsState } from '../accounts.slice';

export interface DjangoRestFrameworkResult<T> {
  count: number;
  results: T[];
  next: string | null;
  previous: string | null;
}

export interface IUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  id: string | number;
}

// Added the AUTH state here so there are no circular deps
interface IAuthenticationState {
  isAuthenticated: boolean;
  accessToken: string | null;
}

export interface IAccount {
  title: string;
}

export const AccountsApi = createApi({
  reducerPath: 'AccountsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as {
        authentication: IAuthenticationState;
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
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    getProfile: builder.query<IUserProfile, Partial<void>>({
      query: (_params) => {
        return {
          url: 'user-profile/',
        };
      },
    }),
    getAllAccounts: builder.query<
      DjangoRestFrameworkResult<{
        id: string;
        title: string;
        isClient: boolean;
      }>,
      Partial<void>
    >({
      query: (_params) => {
        return {
          url: 'accounts/',
        };
      },
    }),
    getAccount: builder.query<IAccount, Partial<string | null>>({
      query: (_params) => {
        return {
          url: `accounts/${_params}`,
        };
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetAllAccountsQuery,
  useGetAccountQuery,
} = AccountsApi;
