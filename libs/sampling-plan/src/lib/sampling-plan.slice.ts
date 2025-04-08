import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const SAMPLING_PLAN_FEATURE_KEY = 'samplingPlan';

export interface SamplingPlanEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SamplingPlanState extends EntityState<SamplingPlanEntity> {
  needsRefetch: boolean;
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const samplingPlanAdapter = createEntityAdapter<SamplingPlanEntity>();

export const initialSamplingPlanState: SamplingPlanState =
  samplingPlanAdapter.getInitialState({
    needsRefetch: false,
    itemsPerPage: 10,
    page: 0,
    orderBy: '',
    orderDirection: OrderDirection.ASC,
    search: '',
  });

export const SamplingPlanSlice = createSlice({
  name: SAMPLING_PLAN_FEATURE_KEY,
  initialState: initialSamplingPlanState,
  reducers: {
    updateNeedsRefetch: (
      state: SamplingPlanState,
      { payload: { needsRefetch } },
    ) => {
      state.needsRefetch = needsRefetch;
    },
    updatePage: (state: SamplingPlanState, { payload: { page } }) => {
      state.page = page;
    },
    updateItemsPerPage: (
      state: SamplingPlanState,
      { payload: { itemsPerPage } },
    ) => {
      state.itemsPerPage = itemsPerPage;
    },
    updateOrdering: (state: SamplingPlanState, { payload: { orderBy } }) => {
      state.orderDirection =
        state.orderBy === orderBy && state.orderDirection === OrderDirection.ASC
          ? OrderDirection.DESC
          : OrderDirection.ASC;
      state.orderBy = orderBy;
    },
    updateSearch: (state: SamplingPlanState, { payload: { search } }) => {
      state.search = search;
    },
  },
});

export const samplingPlanActions = SamplingPlanSlice.actions;

const { selectAll, selectEntities } = samplingPlanAdapter.getSelectors();

export const getSamplingPlanState = (rootState: {
  [SAMPLING_PLAN_FEATURE_KEY]: SamplingPlanState;
}): SamplingPlanState => rootState[SAMPLING_PLAN_FEATURE_KEY];

export const selectAllSamplingPlan = createSelector(
  getSamplingPlanState,
  selectAll,
);

export const selectSamplingPlanEntities = createSelector(
  getSamplingPlanState,
  selectEntities,
);
