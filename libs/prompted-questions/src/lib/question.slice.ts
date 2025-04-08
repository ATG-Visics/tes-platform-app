import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const QUESTION_FEATURE_KEY = 'question';

/*
 * Update these interfaces according to your requirements.
 */
export interface QuestionEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface QuestionState extends EntityState<QuestionEntity> {
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const questionAdapter = createEntityAdapter<QuestionEntity>();

export const initialQuestionState: QuestionState =
  questionAdapter.getInitialState({
    itemsPerPage: 10,
    page: 0,
    orderBy: '',
    orderDirection: OrderDirection.ASC,
    search: '',
  });

export const QuestionSlice = createSlice({
  name: QUESTION_FEATURE_KEY,
  initialState: initialQuestionState,
  reducers: {
    updatePage: (state: QuestionState, { payload: { page } }) => {
      state.page = page;
    },
    updateItemsPerPage: (
      state: QuestionState,
      { payload: { itemsPerPage } },
    ) => {
      state.itemsPerPage = itemsPerPage;
    },
    updateOrdering: (state: QuestionState, { payload: { orderBy } }) => {
      state.orderDirection =
        state.orderBy === orderBy && state.orderDirection === OrderDirection.ASC
          ? OrderDirection.DESC
          : OrderDirection.ASC;
      state.orderBy = orderBy;
    },
    updateSearch: (state: QuestionState, { payload: { search } }) => {
      state.search = search;
    },
  },
});

export const questionReducer = QuestionSlice.reducer;

export const questionActions = QuestionSlice.actions;

const { selectAll, selectEntities } = questionAdapter.getSelectors();

export const getQuestionState = (rootState: {
  [QUESTION_FEATURE_KEY]: QuestionState;
}): QuestionState => rootState[QUESTION_FEATURE_KEY];

export const selectAllQuestions = createSelector(getQuestionState, selectAll);

export const selectQuestionEntities = createSelector(
  getQuestionState,
  selectEntities,
);
