import {
  mapListResult,
  useOrdering,
  usePagination,
  useSearch,
} from '@tes/utils-hooks';
import { useGetAllClientsQuery } from '../api';
import {
  CLIENT_FEATURE_KEY,
  clientActions,
  ClientState,
} from '../client.slice';
import { useListSelectionControls } from './ListSelection.hooks';
import { useEffect } from 'react';

export function useFetchList() {
  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [CLIENT_FEATURE_KEY]: ClientState }>(
      CLIENT_FEATURE_KEY,
      clientActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [CLIENT_FEATURE_KEY]: ClientState;
  }>(CLIENT_FEATURE_KEY, clientActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [CLIENT_FEATURE_KEY]: ClientState;
  }>(CLIENT_FEATURE_KEY, clientActions);

  useEffect(() => {
    if (search) {
      onPageChange(null, 0);
      return;
    }
    return;
  }, [onPageChange, search]);

  const response = useGetAllClientsQuery(
    {
      search: debouncedSearch,
      page,
      limit: itemsPerPage,
      orderBy,
    },
    { refetchOnMountOrArgChange: true },
  );

  const { isFetching, isLoading, data, isSuccess } = response;
  const { itemCount, itemList } = mapListResult(data);

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
