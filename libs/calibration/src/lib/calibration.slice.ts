import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { ProjectState } from '@tes/project';

export const CALIBRATION_FEATURE_KEY = 'calibration';

export interface CalibrationEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface CalibrationState extends EntityState<CalibrationEntity> {
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const calibrationAdapter = createEntityAdapter<CalibrationEntity>();

export const initialCalibrationState: CalibrationState =
  calibrationAdapter.getInitialState({
    itemsPerPage: 10,
    page: 0,
    orderBy: '',
    orderDirection: OrderDirection.ASC,
    search: '',
  });

export const CalibrationSlice = createSlice({
  name: CALIBRATION_FEATURE_KEY,
  initialState: initialCalibrationState,
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

export const calibrationReducer = CalibrationSlice.reducer;

export const calibrationActions = CalibrationSlice.actions;

const { selectAll, selectEntities } = calibrationAdapter.getSelectors();

export const getCalibrationState = (rootState: {
  [CALIBRATION_FEATURE_KEY]: CalibrationState;
}): CalibrationState => rootState[CALIBRATION_FEATURE_KEY];

export const selectAllCalibration = createSelector(
  getCalibrationState,
  selectAll,
);

export const selectCalibrationEntities = createSelector(
  getCalibrationState,
  selectEntities,
);
