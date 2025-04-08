import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const CLIENT_FEATURE_KEY = 'client';

/*
 * Update these interfaces according to your requirements.
 */
export interface ClientEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface ClientState extends EntityState<ClientEntity> {
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const clientAdapter = createEntityAdapter<ClientEntity>();

export const initialClientState: ClientState = clientAdapter.getInitialState({
  itemsPerPage: 10,
  page: 0,
  orderBy: '',
  orderDirection: OrderDirection.ASC,
  search: '',
});

export const ClientSlice = createSlice({
  name: CLIENT_FEATURE_KEY,
  initialState: initialClientState,
  reducers: {
    updatePage: (state: ClientState, { payload: { page } }) => {
      state.page = page;
    },
    updateItemsPerPage: (state: ClientState, { payload: { itemsPerPage } }) => {
      state.itemsPerPage = itemsPerPage;
    },
    updateOrdering: (state: ClientState, { payload: { orderBy } }) => {
      state.orderDirection =
        state.orderBy === orderBy && state.orderDirection === OrderDirection.ASC
          ? OrderDirection.DESC
          : OrderDirection.ASC;
      state.orderBy = orderBy;
    },
    updateSearch: (state: ClientState, { payload: { search } }) => {
      state.search = search;
    },
  },
});

export const clientReducer = ClientSlice.reducer;

export const clientActions = ClientSlice.actions;

const { selectAll, selectEntities } = clientAdapter.getSelectors();

export const getClientState = (rootState: {
  [CLIENT_FEATURE_KEY]: ClientState;
}): ClientState => rootState[CLIENT_FEATURE_KEY];

export const selectAllClient = createSelector(getClientState, selectAll);

export const selectClientEntities = createSelector(
  getClientState,
  selectEntities,
);
