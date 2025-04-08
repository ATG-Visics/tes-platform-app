import {
  useSearch,
  usePagination,
  useOrdering,
  mapListResult,
} from '@tes/utils-hooks';
import { useGetAllSurveyMomentsQuery } from '../api';
import {
  surveyActions,
  SURVEY_FEATURE_KEY,
  SurveyState,
} from '../survey.slice';
import { useListSelectionControls } from '@tes/utils-hooks';

export function useFetchList(projectId: string | undefined) {
  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [SURVEY_FEATURE_KEY]: SurveyState }>(
      SURVEY_FEATURE_KEY,
      surveyActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [SURVEY_FEATURE_KEY]: SurveyState;
  }>(SURVEY_FEATURE_KEY, surveyActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [SURVEY_FEATURE_KEY]: SurveyState;
  }>(SURVEY_FEATURE_KEY, surveyActions);

  const response = useGetAllSurveyMomentsQuery(
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
