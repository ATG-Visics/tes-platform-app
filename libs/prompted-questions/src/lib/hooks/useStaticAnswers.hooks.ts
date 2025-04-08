import {
  IAnswerBulkPayload,
  IAnswerPayload,
  useGetAllAnswerPerProjectQuery,
  useUpdateOrCreateAnswerItemsMutation,
} from '../api';
import { useEffect, useMemo, useState } from 'react';
import { mapListResult, RECORD_STATUS } from '@tes/utils-hooks';
import { useBulkSubmitHandler } from './bulkSubmission.hook';

interface IProps {
  projectId: string;
  submitSuccessHandler: () => void;
}

export function useStaticAnswersHooks(props: IProps) {
  const { projectId, submitSuccessHandler } = props;

  const [data, setData] = useState<Partial<IAnswerBulkPayload>>({});

  const {
    data: apiData,
    isSuccess,
    isLoading,
    isError,
  } = useGetAllAnswerPerProjectQuery(projectId, {
    skip: !projectId,
  });

  const recordStatus = useMemo(() => {
    if (isSuccess) {
      return RECORD_STATUS.SUCCEEDED;
    }

    if (isLoading) {
      return RECORD_STATUS.LOADING;
    }

    if (isError) {
      return RECORD_STATUS.FAILED;
    }

    return RECORD_STATUS.IDLE;
  }, [isError, isLoading, isSuccess]);

  const formattedData = useMemo(() => {
    const { itemList } = mapListResult(apiData);

    return itemList
      .filter((item) => !item.surveyMoment)
      .reduce(
        (accumulator, currentValue) => ({
          ...accumulator,
          [currentValue.question]: {
            question: currentValue.question,
            answer: currentValue.answer,
            answerOther: currentValue.answerOther,
            id: currentValue.id,
            createdAt: currentValue.createdAt,
          },
        }),
        {} as { [key: string]: IAnswerPayload | string | null },
      );
  }, [apiData]);

  useEffect(() => {
    if (!formattedData) return;

    return setData(formattedData);
  }, [formattedData]);

  const { submissionStatus, onFormSubmit, submissionError } =
    useBulkSubmitHandler({
      data: { ...data, project: projectId },
      submitSuccessHandler,
      useUpdateOrCreateMutation: useUpdateOrCreateAnswerItemsMutation,
    });

  return {
    data,
    setData,
    recordStatus,
    submissionStatus,
    onFormSubmit,
    submissionError,
  };
}
