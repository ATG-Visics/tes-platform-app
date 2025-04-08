import { useCallback, useEffect, useState } from 'react';
import { useGetOneResultByCategoryQuery } from '../api';
import { RESULT_STATUS } from './useOELResultsByClient';
import {
  mapListResult,
  useOrdering,
  usePagination,
  useSearch,
} from '@tes/utils-hooks';
import {
  PLATFORM_FEATURE_KEY,
  platformActions,
  PlatformState,
} from '../platform.slice';
import { useListSelectionControls } from './ListSelection.hooks';

export function useModalResultList() {
  const [status, setStatus] = useState<RESULT_STATUS>(RESULT_STATUS.IDLE);
  const [modalState, setModalState] = useState(false);
  const [modalData, setModalData] = useState<{
    client: string;
    category: string;
    hazard: string;
  }>({ client: '', category: '', hazard: '' });

  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [PLATFORM_FEATURE_KEY]: PlatformState }>(
      PLATFORM_FEATURE_KEY,
      platformActions,
    );

  const toggleModal = useCallback((value) => setModalState(value), []);

  const handleOpenModal = useCallback(
    (client: string, category: string, hazard: string) => {
      onPageChange(null, 0);
      setModalState(true);
      return setModalData({
        client: client,
        category: category,
        hazard: hazard,
      });
    },
    [onPageChange],
  );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [PLATFORM_FEATURE_KEY]: PlatformState;
  }>(PLATFORM_FEATURE_KEY, platformActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [PLATFORM_FEATURE_KEY]: PlatformState;
  }>(PLATFORM_FEATURE_KEY, platformActions);

  const { data, isSuccess, isError, isLoading, isFetching } =
    useGetOneResultByCategoryQuery(
      {
        ...modalData,
        search: debouncedSearch,
        page,
        limit: itemsPerPage,
        orderBy,
      },
      { skip: !modalData.category },
    );

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

  const { selection, selectionState, onToggleSelectAll, onToggleSelect } =
    useListSelectionControls(itemCount, itemsPerPage, itemList);

  return {
    modalState,
    status,

    handleOpenModal,
    toggleModal,

    itemList,
    itemCount,
    isLoading,
    isFetching,

    search,
    debouncedSearch,
    onSearchChange,

    orderBy,
    orderDirection,
    onUpdateOrdering,

    itemsPerPage,
    page,
    onRowPerPageChange,
    onPageChange,

    selection,
    selectionState,
    onToggleSelectAll,
    onToggleSelect,
  };
}
