import {
  useSearch,
  usePagination,
  useOrdering,
  mapListResult,
} from '@tes/utils-hooks';
import { useGetAllSamplingPlansQuery } from '../api';
import {
  samplingPlanActions,
  SAMPLING_PLAN_FEATURE_KEY,
  SamplingPlanState,
} from '../sampling-plan.slice';
import { useListSelectionControls } from './ListSelection.hooks';

export function useFetchList(projectId?: string) {
  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [SAMPLING_PLAN_FEATURE_KEY]: SamplingPlanState }>(
      SAMPLING_PLAN_FEATURE_KEY,
      samplingPlanActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [SAMPLING_PLAN_FEATURE_KEY]: SamplingPlanState;
  }>(SAMPLING_PLAN_FEATURE_KEY, samplingPlanActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [SAMPLING_PLAN_FEATURE_KEY]: SamplingPlanState;
  }>(SAMPLING_PLAN_FEATURE_KEY, samplingPlanActions);

  const response = useGetAllSamplingPlansQuery(
    {
      search: debouncedSearch,
      page,
      limit: itemsPerPage,
      orderBy,
      project: projectId,
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
