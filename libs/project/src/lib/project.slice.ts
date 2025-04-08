import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const PROJECT_FEATURE_KEY = 'project';

/*
 * Update these interfaces according to your requirements.
 */
export interface ProjectEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface ProjectState extends EntityState<ProjectEntity> {
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const projectAdapter = createEntityAdapter<ProjectEntity>();

export const initialProjectState: ProjectState = projectAdapter.getInitialState(
  {
    itemsPerPage: 10,
    page: 0,
    orderBy: '',
    orderDirection: OrderDirection.ASC,
    search: '',
  },
);

export const ProjectSlice = createSlice({
  name: PROJECT_FEATURE_KEY,
  initialState: initialProjectState,
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

export const projectReducer = ProjectSlice.reducer;

export const projectActions = ProjectSlice.actions;

const { selectAll, selectEntities } = projectAdapter.getSelectors();

export const getProjectState = (rootState: {
  [PROJECT_FEATURE_KEY]: ProjectState;
}): ProjectState => rootState[PROJECT_FEATURE_KEY];

export const selectAllProject = createSelector(getProjectState, selectAll);

export const selectProjectEntities = createSelector(
  getProjectState,
  selectEntities,
);
