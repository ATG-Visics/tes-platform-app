import { createSelector, createSlice } from '@reduxjs/toolkit';

export const ACCOUNTS_FEATURE_KEY = 'accounts';

export enum ACCOUNT_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  FAILED = 'failed',
}

export interface AccountsState {
  accountId: string | null;
  selectedAccount: ACCOUNT_STATUS;
  isClient: boolean;
  fullUserName?: string;
}

const initialData =
  !!localStorage.getItem('accountId') &&
  localStorage.getItem('accountId') !== 'null';

export const initialAccountsState: AccountsState = {
  accountId: localStorage.getItem('accountId') || null,
  selectedAccount: initialData ? ACCOUNT_STATUS.LOADED : ACCOUNT_STATUS.IDLE,
  isClient: localStorage.getItem('isClient') === 'true',
  fullUserName: localStorage.getItem('fullUserName') || '',
};

export const accountsSlice = createSlice({
  name: ACCOUNTS_FEATURE_KEY,
  initialState: initialAccountsState,
  reducers: {
    updateUserAccount: (
      state: AccountsState,
      { payload: { selectedAccount, accountId } },
    ) => {
      state.selectedAccount = selectedAccount;
      state.accountId = accountId;
      localStorage.setItem('accountId', accountId);
    },
    updateIsClient: (state: AccountsState, { payload: { isClient } }) => {
      state.isClient = isClient;
      localStorage.setItem('isClient', isClient);
    },
    updateFullUserName: (
      state: AccountsState,
      { payload: { fullUserName } },
    ) => {
      state.fullUserName = fullUserName;
      localStorage.setItem('fullUserName', fullUserName);
    },
  },
});

export const accountsActions = accountsSlice.actions;

export const getAccountsState = (rootState: {
  [ACCOUNTS_FEATURE_KEY]: AccountsState;
}): AccountsState => rootState[ACCOUNTS_FEATURE_KEY];

export const selectHasSelectedAccount = createSelector(
  getAccountsState,
  (state) => {
    return state.selectedAccount;
  },
);

export const getAccountId = createSelector(getAccountsState, (state) => {
  return state.accountId;
});

export const selectIsClient = createSelector(getAccountsState, (state) => {
  return state.isClient;
});

export const fullUserName = createSelector(getAccountsState, (state) => {
  return state.fullUserName;
});
