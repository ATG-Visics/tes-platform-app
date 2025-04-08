import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const PLATFORM_FEATURE_KEY = 'platform';

export interface PlatformEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface PlatformState extends EntityState<PlatformEntity> {
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const platformAdapter = createEntityAdapter<PlatformEntity>();

export const initialPlatformState: PlatformState =
  platformAdapter.getInitialState({
    itemsPerPage: 10,
    page: 0,
    orderBy: '',
    orderDirection: OrderDirection.ASC,
    search: '',
  });

export const platformSlice = createSlice({
  name: PLATFORM_FEATURE_KEY,
  initialState: initialPlatformState,
  reducers: {
    updatePage: (state: PlatformState, { payload: { page } }) => {
      state.page = page;
    },
    updateItemsPerPage: (
      state: PlatformState,
      { payload: { itemsPerPage } },
    ) => {
      state.itemsPerPage = itemsPerPage;
    },
    updateOrdering: (state: PlatformState, { payload: { orderBy } }) => {
      state.orderDirection =
        state.orderBy === orderBy && state.orderDirection === OrderDirection.ASC
          ? OrderDirection.DESC
          : OrderDirection.ASC;
      state.orderBy = orderBy;
    },
    updateSearch: (state: PlatformState, { payload: { search } }) => {
      state.search = search;
    },
  },
});

/*
 * Export reducer for store configuration.
 */
export const platformReducer = platformSlice.reducer;

export const platformActions = platformSlice.actions;

const { selectAll, selectEntities } = platformAdapter.getSelectors();

export const getPlatformState = (rootState: {
  [PLATFORM_FEATURE_KEY]: PlatformState;
}): PlatformState => rootState[PLATFORM_FEATURE_KEY];

export const selectAllPlatform = createSelector(getPlatformState, selectAll);

export const selectPlatformEntities = createSelector(
  getPlatformState,
  selectEntities,
);
