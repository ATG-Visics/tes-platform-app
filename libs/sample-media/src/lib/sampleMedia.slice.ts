import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const SAMPLE_MEDIA_FEATURE_KEY = 'sampleMedia';

export interface SampleMediaEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SampleMediaState extends EntityState<SampleMediaEntity> {
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const sampleMediaAdapter = createEntityAdapter<SampleMediaEntity>();

export const initialSampleMediaState: SampleMediaState =
  sampleMediaAdapter.getInitialState({
    itemsPerPage: 10,
    page: 0,
    orderBy: '',
    orderDirection: OrderDirection.ASC,
    search: '',
  });

export const sampleMediaSlice = createSlice({
  name: SAMPLE_MEDIA_FEATURE_KEY,
  initialState: initialSampleMediaState,
  reducers: {
    updatePage: (state: SampleMediaState, { payload: { page } }) => {
      state.page = page;
    },
    updateItemsPerPage: (
      state: SampleMediaState,
      { payload: { itemsPerPage } },
    ) => {
      state.itemsPerPage = itemsPerPage;
    },
    updateOrdering: (state: SampleMediaState, { payload: { orderBy } }) => {
      state.orderDirection =
        state.orderBy === orderBy && state.orderDirection === OrderDirection.ASC
          ? OrderDirection.DESC
          : OrderDirection.ASC;
      state.orderBy = orderBy;
    },
    updateSearch: (state: SampleMediaState, { payload: { search } }) => {
      state.search = search;
    },
  },
});

export const sampleMediaReducer = sampleMediaSlice.reducer;

export const sampleMediaActions = sampleMediaSlice.actions;

const { selectAll, selectEntities } = sampleMediaAdapter.getSelectors();

export const getSampleMediaState = (rootState: {
  [SAMPLE_MEDIA_FEATURE_KEY]: SampleMediaState;
}): SampleMediaState => rootState[SAMPLE_MEDIA_FEATURE_KEY];

export const selectAllSampleMedia = createSelector(
  getSampleMediaState,
  selectAll,
);

export const selectSampleMediaEntities = createSelector(
  getSampleMediaState,
  selectEntities,
);
