import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const SURVEY_FEATURE_KEY = 'surveyMoment';

/*
 * Update these interfaces according to your requirements.
 */
export interface SurveyEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SurveyState extends EntityState<SurveyEntity> {
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const surveyAdapter = createEntityAdapter<SurveyEntity>();

export const initialSurveyState: SurveyState = surveyAdapter.getInitialState({
  itemsPerPage: 10,
  page: 0,
  orderBy: '',
  orderDirection: OrderDirection.DESC,
  search: '',
});

export const surveySlice = createSlice({
  name: SURVEY_FEATURE_KEY,
  initialState: initialSurveyState,
  reducers: {
    updatePage: (state: SurveyState, { payload: { page } }) => {
      state.page = page;
    },
    updateItemsPerPage: (state: SurveyState, { payload: { itemsPerPage } }) => {
      state.itemsPerPage = itemsPerPage;
    },
    updateOrdering: (state: SurveyState, { payload: { orderBy } }) => {
      state.orderDirection =
        state.orderBy === orderBy && state.orderDirection === OrderDirection.ASC
          ? OrderDirection.DESC
          : OrderDirection.ASC;
      state.orderBy = orderBy;
    },
    updateSearch: (state: SurveyState, { payload: { search } }) => {
      state.search = search;
    },
  },
});

export const surveyReducer = surveySlice.reducer;

export const surveyActions = surveySlice.actions;

const { selectAll, selectEntities } = surveyAdapter.getSelectors();

export const getSurveyState = (rootState: {
  [SURVEY_FEATURE_KEY]: SurveyState;
}): SurveyState => rootState[SURVEY_FEATURE_KEY];

export const selectAllClient = createSelector(getSurveyState, selectAll);

export const selectClientEntities = createSelector(
  getSurveyState,
  selectEntities,
);
