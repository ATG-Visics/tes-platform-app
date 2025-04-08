import {
  mapListResult,
  useOrdering,
  usePagination,
  useSearch,
} from '@tes/utils-hooks';
import { IQuestionListItem, useGetQuestionGroupByAccountQuery } from '../api';
import {
  QUESTION_FEATURE_KEY,
  questionActions,
  QuestionState,
} from '../question.slice';
import { useListSelectionControls } from './ListSelection.hooks';
import { useEffect } from 'react';

export function useFetchList() {
  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [QUESTION_FEATURE_KEY]: QuestionState }>(
      QUESTION_FEATURE_KEY,
      questionActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [QUESTION_FEATURE_KEY]: QuestionState;
  }>(QUESTION_FEATURE_KEY, questionActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [QUESTION_FEATURE_KEY]: QuestionState;
  }>(QUESTION_FEATURE_KEY, questionActions);

  useEffect(() => {
    if (search) {
      onPageChange(null, 0);
      return;
    }
    return;
  }, [onPageChange, search]);

  const response = useGetQuestionGroupByAccountQuery(
    {
      search: debouncedSearch,
      page,
      limit: itemsPerPage,
      orderBy,
    },
    { refetchOnMountOrArgChange: true },
  );

  const { isFetching, isLoading, data, isSuccess } = response;

  const { itemCount, itemList } = mapListResult<IQuestionListItem>(data);

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
