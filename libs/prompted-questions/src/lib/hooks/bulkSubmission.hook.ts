import { UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from '@reduxjs/toolkit/query';
import { FormEvent, useCallback, useMemo, useState } from 'react';

export enum SUBMISSION_STATUS {
  IDLE = 'idle',
  SAVING = 'saving',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export type ISubmissionError = {
  status: number;
  data?: unknown;
};

interface IProps<
  TagTypes extends string,
  ResultType,
  ReducerPath extends string,
  ISubmissionPayload,
> {
  data: Partial<ISubmissionPayload>;
  recordId?: string;
  submitSuccessHandler: (successData: ResultType) => void;
  useUpdateOrCreateMutation: UseMutation<
    MutationDefinition<
      Partial<ISubmissionPayload>,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      TagTypes,
      ResultType,
      ReducerPath
    >
  >;
  useUpdateMutation?: UseMutation<
    MutationDefinition<
      { uuid: string; body: Partial<ISubmissionPayload> },
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      TagTypes,
      ResultType,
      ReducerPath
    >
  >;
}

export function useBulkSubmitHandler<
  TagTypes extends string,
  ResultType,
  ReducerPath extends string,
  ISubmissionPayload,
>(props: IProps<TagTypes, ResultType, ReducerPath, ISubmissionPayload>) {
  const {
    data,
    submitSuccessHandler,
    useUpdateOrCreateMutation,
    useUpdateMutation,
    recordId,
  } = props;

  const [create] = useUpdateOrCreateMutation();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [update] = useUpdateMutation ? useUpdateMutation() : [null];
  const [submissionStatus, setSubmissionStatus] = useState<SUBMISSION_STATUS>(
    SUBMISSION_STATUS.IDLE,
  );
  const [submissionError, setSubmissionError] =
    useState<null | ISubmissionError>(null);
  const isSubmissionValidationError = useMemo(
    () => submissionError !== null && submissionError.status === 400,
    [submissionError],
  );

  const submitHandler = useCallback(
    (submissionData?: ISubmissionPayload) => {
      if (submissionStatus === SUBMISSION_STATUS.SAVING) {
        // eslint-disable-next-line no-console
        console.warn('Submission already in progress');
        return;
      }

      setSubmissionError(null);

      const customData = submissionData || data;

      setSubmissionStatus(SUBMISSION_STATUS.SAVING);
      if (!recordId) {
        create({
          ...customData,
        })
          .unwrap()
          .then(
            (successData) => {
              setSubmissionStatus(SUBMISSION_STATUS.SUCCEEDED);
              submitSuccessHandler(successData);
            },
            (error) => {
              setSubmissionStatus(SUBMISSION_STATUS.FAILED);
              setSubmissionError(error);
            },
          );
      } else {
        if (update === null) {
          throw Error('You have not provided an update-method');
        }

        update({
          uuid: recordId,
          body: customData,
        })
          .unwrap()
          .then(
            (successData) => {
              setSubmissionStatus(SUBMISSION_STATUS.SUCCEEDED);
              submitSuccessHandler(successData);
            },
            (error) => {
              setSubmissionStatus(SUBMISSION_STATUS.FAILED);
              setSubmissionError(error);
            },
          );
      }
    },
    [create, data, submissionStatus, submitSuccessHandler],
  );

  const onFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      submitHandler();
    },
    [submitHandler],
  );

  return useMemo(
    () => ({
      submissionStatus,
      submissionError,
      isSubmissionValidationError,
      submitHandler,
      onFormSubmit,
    }),
    [
      isSubmissionValidationError,
      onFormSubmit,
      submissionError,
      submissionStatus,
      submitHandler,
    ],
  );
}
