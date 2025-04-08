import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  IAnswerBulkPayload,
  IAnswerPayload,
  useGetAllAnswerPerProjectAndSurveyMomentQuery,
  useUpdateOrCreateAnswerItemsMutation,
} from '../api';
import { useBulkSubmitHandler } from './bulkSubmission.hook';
import { mapListResult, RECORD_STATUS } from '@tes/utils-hooks';

interface IProps {
  projectId: string;
  submitSuccessHandler: () => void;
  selectedDate: string;
}

export function useDynamicAnswersHooks(props: IProps) {
  const { projectId, submitSuccessHandler, selectedDate } = props;

  const [dynamicData, setDynamicData] = useState<Partial<IAnswerBulkPayload>>(
    {},
  );

  const {
    data: dynamicAPIData,
    isSuccess: dynamicSuccess,
    isLoading: dynamicLoading,
    isError: dynamicError,
  } = useGetAllAnswerPerProjectAndSurveyMomentQuery(
    { projectId, selectedDate },
    {
      skip: !projectId,
      refetchOnMountOrArgChange: true,
    },
  );

  const recordStatus = useMemo(() => {
    if (dynamicSuccess) {
      return RECORD_STATUS.SUCCEEDED;
    }

    if (dynamicLoading) {
      return RECORD_STATUS.LOADING;
    }

    if (dynamicError) {
      return RECORD_STATUS.FAILED;
    }

    return RECORD_STATUS.IDLE;
  }, [dynamicError, dynamicLoading, dynamicSuccess]);

  const formattedData = useMemo(() => {
    const { itemList: dynamicItemList } = mapListResult(dynamicAPIData);

    return dynamicItemList.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.question]: {
          question: currentValue.question,
          answer: currentValue.answer,
          answerOther: currentValue.answerOther,
          id: currentValue.id,
          createdAt: currentValue.createdAt,
          updatedAt: currentValue.updatedAt,
        },
      }),
      {} as { [key: string]: IAnswerPayload | string | null },
    );
  }, [dynamicAPIData]);

  useEffect(() => {
    if (!formattedData) {
      return;
    }

    return setDynamicData(formattedData);
  }, [formattedData]);

  const { submissionStatus: dynamicSubmissionStatus, submitHandler } =
    useBulkSubmitHandler({
      data: dynamicData,
      submitSuccessHandler,
      useUpdateOrCreateMutation: useUpdateOrCreateAnswerItemsMutation,
    });

  const onDynamicFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!dynamicData) {
        return;
      }

      const submissionData = Object.keys(dynamicData).reduce((acc, key) => {
        if (key !== 'project') {
          acc[key] = {
            ...(dynamicData[key] as IAnswerPayload),
            surveyMoment: {
              project: projectId,
              startDate: selectedDate,
            },
          };
        } else {
          acc[key] = dynamicData[key];
        }
        return acc;
      }, dynamicData);

      submitHandler({ ...submissionData, project: projectId });
    },
    [dynamicData, projectId, submitHandler],
  );

  return {
    dynamicData,
    setDynamicData,
    dynamicSubmissionStatus,
    onDynamicFormSubmit,
    recordStatus,
  };
}
