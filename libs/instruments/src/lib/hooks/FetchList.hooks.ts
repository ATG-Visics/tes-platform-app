import {
  mapListResult,
  useListSelectionControls,
  useOrdering,
  usePagination,
  useSearch,
} from '@tes/utils-hooks';
import { IInstrumentListItem, useGetAllInstrumentsQuery } from '../api';
import {
  INSTRUMENTS_FEATURE_KEY,
  instrumentsActions,
  InstrumentsState,
} from '../instrumentSlice';
import { useEffect } from 'react';

export function useFetchList() {
  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [INSTRUMENTS_FEATURE_KEY]: InstrumentsState }>(
      INSTRUMENTS_FEATURE_KEY,
      instrumentsActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [INSTRUMENTS_FEATURE_KEY]: InstrumentsState;
  }>(INSTRUMENTS_FEATURE_KEY, instrumentsActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [INSTRUMENTS_FEATURE_KEY]: InstrumentsState;
  }>(INSTRUMENTS_FEATURE_KEY, instrumentsActions);

  useEffect(() => {
    if (search) {
      onPageChange(null, 0);
      return;
    }
    return;
  }, [onPageChange, search]);

  const response = useGetAllInstrumentsQuery(
    {
      search: debouncedSearch,
      page,
      limit: itemsPerPage,
      orderBy,
    },
    { refetchOnMountOrArgChange: true },
  );

  const { isFetching, isLoading, data, isSuccess } = response;
  const { itemCount, itemList } = mapListResult<IInstrumentListItem>(data);

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
