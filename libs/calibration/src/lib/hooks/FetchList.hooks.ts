import {
  mapListResult,
  useListSelectionControls,
  useOrdering,
  usePagination,
  useSearch,
} from '@tes/utils-hooks';
import { ICalibrationListItem, useGetAllCalibrationDevicesQuery } from '../api';
import {
  CALIBRATION_FEATURE_KEY,
  calibrationActions,
  CalibrationState,
} from '../calibration.slice';
import { useEffect } from 'react';

export function useFetchList() {
  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [CALIBRATION_FEATURE_KEY]: CalibrationState }>(
      CALIBRATION_FEATURE_KEY,
      calibrationActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [CALIBRATION_FEATURE_KEY]: CalibrationState;
  }>(CALIBRATION_FEATURE_KEY, calibrationActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [CALIBRATION_FEATURE_KEY]: CalibrationState;
  }>(CALIBRATION_FEATURE_KEY, calibrationActions);

  useEffect(() => {
    if (search) {
      onPageChange(null, 0);
      return;
    }
    return;
  }, [onPageChange, search]);

  const response = useGetAllCalibrationDevicesQuery(
    {
      search: debouncedSearch,
      page,
      limit: itemsPerPage,
      orderBy,
    },
    { refetchOnMountOrArgChange: true },
  );

  const { isFetching, isLoading, data, isSuccess } = response;
  const { itemCount, itemList } = mapListResult<ICalibrationListItem>(data);

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
