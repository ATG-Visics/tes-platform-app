import {
  mapListResult,
  useOrdering,
  usePagination,
  useSearch,
} from '@tes/utils-hooks';
import { IProjectListItem, useGetAllProjectsQuery } from '../api';
import {
  PROJECT_FEATURE_KEY,
  projectActions,
  ProjectState,
} from '../project.slice';
import { useListSelectionControls } from './ListSelection.hooks';
import { useEffect } from 'react';

export function useFetchList() {
  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [PROJECT_FEATURE_KEY]: ProjectState }>(
      PROJECT_FEATURE_KEY,
      projectActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [PROJECT_FEATURE_KEY]: ProjectState;
  }>(PROJECT_FEATURE_KEY, projectActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [PROJECT_FEATURE_KEY]: ProjectState;
  }>(PROJECT_FEATURE_KEY, projectActions);

  useEffect(() => {
    if (search) {
      onPageChange(null, 0);
      return;
    }
    return;
  }, [onPageChange, search]);

  const response = useGetAllProjectsQuery(
    {
      search: debouncedSearch,
      page,
      limit: itemsPerPage,
      orderBy,
    },
    { refetchOnMountOrArgChange: true },
  );

  const { isFetching, isLoading, data, isSuccess } = response;
  const { itemCount, itemList } = mapListResult<IProjectListItem>(data);

  const showPagination = itemCount > itemsPerPage;

  const pageCount = Math.ceil(itemCount / itemsPerPage);

  const { selection, selectionState, onToggleSelectAll, onToggleSelect } =
    useListSelectionControls(itemCount, itemsPerPage, itemList);

  return {
    showPagination,
    pageCount,
    itemsPerPage,
    page,
    onRowPerPageChange,
    onPageChange,

    isLoading,
    isFetching,
    isSuccess,
    itemCount,
    itemList,

    selection,
    selectionState,
    onToggleSelectAll,
    onToggleSelect,

    search,
    debouncedSearch,
    onSearchChange,

    orderBy,
    orderDirection,
    onUpdateOrdering,
  };
}
