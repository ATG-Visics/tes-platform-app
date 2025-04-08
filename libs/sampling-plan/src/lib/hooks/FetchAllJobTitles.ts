import {
  mapListResult,
  useOrdering,
  usePagination,
  useSearch,
} from '@tes/utils-hooks';
import { useGetAllJobTitlesQuery } from '../api';
import {
  SAMPLING_PLAN_FEATURE_KEY,
  samplingPlanActions,
  SamplingPlanState,
} from '../sampling-plan.slice';

export function useFetchAllJobTitles(projectId: string) {
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

  const response = useGetAllJobTitlesQuery(
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

    search,
    debouncedSearch,
    onSearchChange,

    orderBy,
    orderDirection,
    onUpdateOrdering,
  };
}
