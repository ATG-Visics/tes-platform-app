import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { ProjectState } from '@tes/project';

export const INSTRUMENTS_FEATURE_KEY = 'instruments';

export interface InstrumentEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface InstrumentsState extends EntityState<InstrumentEntity> {
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const instrumentsAdapter = createEntityAdapter<InstrumentEntity>();

export const initialInstrumentsState: InstrumentsState =
  instrumentsAdapter.getInitialState({
    itemsPerPage: 10,
    page: 0,
    orderBy: '',
    orderDirection: OrderDirection.ASC,
    search: '',
  });

export const InstrumentSlice = createSlice({
  name: INSTRUMENTS_FEATURE_KEY,
  initialState: initialInstrumentsState,
  reducers: {
    updatePage: (state: ProjectState, { payload: { page } }) => {
      state.page = page;
    },
    updateItemsPerPage: (
      state: ProjectState,
      { payload: { itemsPerPage } },
    ) => {
      state.itemsPerPage = itemsPerPage;
    },
    updateOrdering: (state: ProjectState, { payload: { orderBy } }) => {
      state.orderDirection =
        state.orderBy === orderBy && state.orderDirection === OrderDirection.ASC
          ? OrderDirection.DESC
          : OrderDirection.ASC;
      state.orderBy = orderBy;
    },
    updateSearch: (state: ProjectState, { payload: { search } }) => {
      state.search = search;
    },
  },
});

export const instrumentsReducer = InstrumentSlice.reducer;

export const instrumentsActions = InstrumentSlice.actions;

const { selectAll, selectEntities } = instrumentsAdapter.getSelectors();

export const getInstrumentsState = (rootState: {
  [INSTRUMENTS_FEATURE_KEY]: InstrumentsState;
}): InstrumentsState => rootState[INSTRUMENTS_FEATURE_KEY];

export const selectAllInstruments = createSelector(
  getInstrumentsState,
  selectAll,
);

export const selectInstrumentsEntities = createSelector(
  getInstrumentsState,
  selectEntities,
);
