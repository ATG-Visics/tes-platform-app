import { createSelector, createSlice } from '@reduxjs/toolkit';

export const AUTHENTICATION_FEATURE_KEY = 'authentication';

export interface AuthenticationState {
  isAuthenticated: boolean;
  accessToken: string | null;
}

export const initialAuthenticationState: AuthenticationState = {
  isAuthenticated: false,
  accessToken: null,
};

export const AuthenticationSlice = createSlice({
  name: AUTHENTICATION_FEATURE_KEY,
  initialState: initialAuthenticationState,
  reducers: {
    updateUser: (state, { payload: { isAuthenticated, accessToken } }) => {
      state.isAuthenticated = isAuthenticated;
      state.accessToken = accessToken;
    },
  },
});

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(authenticationActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const authenticationActions = AuthenticationSlice.actions;
//
// /*
//  * Export selectors to query state. For use with the `useSelector` hook.
//  *
//  * e.g.
//  * ```
//  * import { useSelector } from 'react-redux';
//  *
//  * // ...
//  *
//  * const entities = useSelector(selectAllAuthentication);
//  * ```
//  *
//  * See: https://react-redux.js.org/next/api/hooks#useselector
//  */
//
export const getAuthenticationState = (rootState: {
  [AUTHENTICATION_FEATURE_KEY]: AuthenticationState;
}): AuthenticationState => rootState[AUTHENTICATION_FEATURE_KEY];

export const selectIsAuthenticated = createSelector(
  getAuthenticationState,
  (state) => state.isAuthenticated,
);
