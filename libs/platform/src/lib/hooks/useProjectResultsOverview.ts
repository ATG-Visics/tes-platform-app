import { useEffect, useState } from 'react';
import { mapListResult, usePagination, useSearch } from '@tes/utils-hooks';
import {
  PLATFORM_FEATURE_KEY,
  platformActions,
  PlatformState,
} from '../platform.slice';
import { RESULT_STATUS } from './useOELResultsByClient';
import { useGetProjectResultsOverviewQuery } from '../api';

export function useProjectResultsOverview() {
  const [status, setStatus] = useState<RESULT_STATUS>(RESULT_STATUS.IDLE);

  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [PLATFORM_FEATURE_KEY]: PlatformState }>(
      PLATFORM_FEATURE_KEY,
      platformActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [PLATFORM_FEATURE_KEY]: PlatformState;
  }>(PLATFORM_FEATURE_KEY, platformActions);

  const { data, isSuccess, isError, isLoading, isFetching } =
    useGetProjectResultsOverviewQuery({
      search: debouncedSearch,
      page,
      limit: itemsPerPage,
    });

  const { itemList, itemCount } = mapListResult(data);

  useEffect(() => {
    if (isLoading) {
      return setStatus(RESULT_STATUS.LOADING);
    }
    if (isError) {
      return setStatus(RESULT_STATUS.FAILED);
    }

    if (!data) {
      return setStatus(RESULT_STATUS.FAILED);
    }

    return setStatus(RESULT_STATUS.SUCCEEDED);
  }, [data, isError, isLoading, isSuccess]);

  return {
    status,

    itemList,
    itemCount,
    isLoading,
    isFetching,

    search,
    debouncedSearch,
    onSearchChange,

    itemsPerPage,
    page,
    onRowPerPageChange,
    onPageChange,
  };
}
