import {
  mapListResult,
  useOrdering,
  usePagination,
  useSearch,
} from '@tes/utils-hooks';
import { useGetAllSampleMediaQuery } from '../api';
import {
  SAMPLE_MEDIA_FEATURE_KEY,
  sampleMediaActions,
  SampleMediaState,
} from '../sampleMedia.slice';
import { useListSelectionControls } from './ListSelection.hooks';
import { useEffect } from 'react';

export function useFetchList() {
  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [SAMPLE_MEDIA_FEATURE_KEY]: SampleMediaState }>(
      SAMPLE_MEDIA_FEATURE_KEY,
      sampleMediaActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [SAMPLE_MEDIA_FEATURE_KEY]: SampleMediaState;
  }>(SAMPLE_MEDIA_FEATURE_KEY, sampleMediaActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [SAMPLE_MEDIA_FEATURE_KEY]: SampleMediaState;
  }>(SAMPLE_MEDIA_FEATURE_KEY, sampleMediaActions);

  useEffect(() => {
    if (search) {
      onPageChange(null, 0);
      return;
    }
    return;
  }, [onPageChange, search]);

  const response = useGetAllSampleMediaQuery(
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
