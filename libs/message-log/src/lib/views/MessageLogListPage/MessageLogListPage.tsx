import { LogCard } from '@tes/platform';
import {
  IMessageLogPayload,
  useCreateMessageLogFileMutation,
  useCreateMessageLogMutation,
  useDownloadLogMessagesPDFStarterMutation,
  useDownloadLogMessagesPDFStatusQuery,
  useGetAllMessageLogQuery,
} from '../../api';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import { CircularProgress } from '@mui/material';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  DOWNLOAD_STATUS,
  ISubmissionError,
  mapListResult,
  SUBMISSION_STATUS,
  useDownloadHooks,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import { useGetProfileQuery } from '@tes/accounts';
import { useGetAllPersonSampleSubjectQuery } from '@tes/person-subject-api';
import { useGetAllAreaSampleSubjectQuery } from '@tes/area-subject-api';
import {
  sampleActions,
  useGetAllSamplesBySurveyMomentQuery,
} from '@tes/samples';
import { useDispatch } from 'react-redux';
import { useGetProjectByIdQuery } from '@tes/project';
import { UPDATE_STATUS, useUpdateLogMessage } from '../../hooks';

interface IProps {
  surveyMomentId: {
    project: string;
    startDate: string;
  };
}

export enum UPLOAD_STATUS {
  IDLE = 'idle',
  SAVING = 'saving',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function MessageLogListPage(props: IProps) {
  const { surveyMomentId } = props;
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [clear, setClear] = useState<boolean>(false);
  const [isOpenSubmission, setIsOpenSubmission] = useState<boolean>(true);
  const [data, setData] = useState<Partial<IMessageLogPayload>>({});
  const dispatch = useDispatch();
  const { updateNeedsRefetch } = sampleActions;

  const [open, setOpen] = useState(true);
  const [hasError, setHasError] = useState<{
    hasError: boolean;
    errorMessage: null | ISubmissionError;
  }>({ hasError: false, errorMessage: null });

  const [uploadStatus, setUploadStatus] = useState<UPLOAD_STATUS>(
    UPLOAD_STATUS.IDLE,
  );
  const [submissionError, setSubmissionError] =
    useState<null | ISubmissionError>(null);
  const { data: userData } = useGetProfileQuery();

  const [create] = useCreateMessageLogFileMutation();

  const {
    data: messageData,
    isLoading,
    isError,
  } = useGetAllMessageLogQuery({ surveyMomentId });
  const { itemList } = mapListResult(messageData);

  const submitSuccessHandler = useCallback((successData) => {
    if (!successData) {
      return;
    }
    setData((prevState) => ({ ...prevState, message: '' }));
    setClear(true);
  }, []);

  useEffect(() => {
    if (!surveyMomentId) {
      return;
    }

    setData({ surveyMoment: surveyMomentId, author: userData?.id });
  }, [surveyMomentId, userData?.id]);

  const {
    submissionStatus,
    submitHandler,
    submissionError: messageLogSubmissionError,
  } = useSubmitHandler({
    isNewRecord: true,
    data,
    recordId: '',
    submitSuccessHandler,
    useCreateMutation: useCreateMessageLogMutation,
  });

  const onFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!data.message) {
        setUploadStatus(UPLOAD_STATUS.FAILED);
        return;
      }

      submitHandler();
    },
    [data, submitHandler],
  );

  const {
    updatedLogMessage,
    handleUpdate,
    submitUpdatedMessage,
    submitUpdateError,
    updateStatus,
    updateState,
    setUpdateState,
  } = useUpdateLogMessage();

  const handlePPSUpload = useCallback(
    (file: File) => {
      if (uploadStatus === UPLOAD_STATUS.SAVING) {
        // eslint-disable-next-line no-console
        console.warn('Submission already in progress');
        return;
      }

      if (!userData?.id) {
        setUploadStatus(UPLOAD_STATUS.FAILED);
        return;
      }

      create({
        author: userData?.id,
        surveyMoment: surveyMomentId,
        file: file,
      })
        .unwrap()
        .then(
          () => {
            setUploadStatus(UPLOAD_STATUS.SUCCEEDED);
          },
          (error) => {
            setUploadStatus(UPLOAD_STATUS.FAILED);
            setSubmissionError(error);
          },
        );
    },
    [create, surveyMomentId, uploadStatus, userData?.id],
  );

  const { onClickDownload, downloadStatus, downloadError } = useDownloadHooks({
    useStartMutation: useDownloadLogMessagesPDFStarterMutation,
    useStatusQuery: useDownloadLogMessagesPDFStatusQuery,
  });

  const { record } = useRecord({
    useRecordQuery: useGetProjectByIdQuery,
  });

  const { data: personSubjectData, isLoading: personIsLoading } =
    useGetAllPersonSampleSubjectQuery({ surveyMomentId: surveyMomentId });

  const { itemList: personSubjectList } = mapListResult(personSubjectData);

  const { data: areaSubjectData, isLoading: areaIsLoading } =
    useGetAllAreaSampleSubjectQuery({ surveyMomentId: surveyMomentId });

  const { itemList: areaSubjectList } = mapListResult(areaSubjectData);

  const { data: sampleData, isLoading: sampleIsLoading } =
    useGetAllSamplesBySurveyMomentQuery({
      surveyMomentId: surveyMomentId,
    });

  const { itemList: sampleList } = mapListResult(sampleData);

  const atMentionData = useMemo(() => {
    if (!personSubjectList) {
      return [];
    }

    if (!areaSubjectList) {
      return [];
    }

    const formattedPersons = personSubjectList.map((personSubject) => ({
      id: personSubject.id,
      display: personSubject.title,
    }));

    const formattedAreas = areaSubjectList.map((areaSubject) => ({
      id: areaSubject.id,
      display: areaSubject.title,
    }));

    return [
      { id: 'all', display: 'All' },
      ...formattedPersons,
      ...formattedAreas,
    ];
  }, [personSubjectList, areaSubjectList]);

  const hashtagMentionData = useMemo(() => {
    if (!sampleList) {
      return [];
    }

    const allSamples = sampleList.map((sample) => ({
      id: sample.id,
      display: sample.sampleId,
    }));

    return [{ id: 'all', display: 'All' }, ...allSamples];
  }, [sampleList]);

  const newList = useMemo(() => {
    if (!itemList) {
      return [];
    }

    return itemList.map((item) => {
      let message = item.message ? item.message : null;

      if (!message) {
        return { ...item };
      }

      let personSampleSubjectMessage = message;

      const personSampleSubjectMessageReplaceIds =
        item.mentionedPersonSampleSubjects.map((personSample) => {
          if (!personSampleSubjectMessage) {
            return null;
          }

          personSampleSubjectMessage = personSampleSubjectMessage.replaceAll(
            `[${personSample.id}]`,
            personSample.title,
          );

          return personSampleSubjectMessage;
        });

      if (personSampleSubjectMessageReplaceIds.length) {
        message =
          personSampleSubjectMessageReplaceIds[
            personSampleSubjectMessageReplaceIds.length - 1
          ];
      }

      let areaSampleSubjectMessage = message;

      const areaSampleSubjectMessageReplacedIds =
        item.mentionedAreaSampleSubjects.map((areaSample) => {
          if (!areaSampleSubjectMessage) {
            return null;
          }

          areaSampleSubjectMessage = areaSampleSubjectMessage.replaceAll(
            `[${areaSample.id}]`,
            areaSample.title,
          );

          return areaSampleSubjectMessage;
        });

      if (areaSampleSubjectMessageReplacedIds.length) {
        message =
          areaSampleSubjectMessageReplacedIds[
            areaSampleSubjectMessageReplacedIds.length - 1
          ];
      }

      let sampleMessage = message;

      const sampleMessageReplacedIds = item.mentionedSamples.map((sample) => {
        if (!sampleMessage) {
          return null;
        }

        sampleMessage = sampleMessage.replaceAll(
          `[${sample.id}]`,
          sample.sampleId,
        );
        return sampleMessage;
      });

      if (sampleMessageReplacedIds.length) {
        message = sampleMessageReplacedIds[sampleMessageReplacedIds.length - 1];
      }

      dispatch(updateNeedsRefetch({ needsRefetch: true }));

      if (message?.includes('@[all]')) {
        // string.replace only replaces the first occurrence.
        message = message?.split('@[all]').join('@All');
      }

      if (message?.includes('#[all]')) {
        // string.replace only replaces the first occurrence.
        message = message?.split('#[all]').join('#All');
      }

      if (message?.includes('$[all]')) {
        // string.replace only replaces the first occurrence.
        message = message?.split('$[all]').join('$All');
      }

      return { ...item, message: message };
    });
  }, [dispatch, itemList, updateNeedsRefetch]);

  if (!itemList) {
    return <PageNotFound />;
  }

  return (
    <>
      {isError && <PageNotFound />}

      {downloadStatus === DOWNLOAD_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred when downloading the PDF form the server"
          description={downloadError}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {hasError.hasError && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to download the PDF again."
          showButton
          errorList={hasError.errorMessage?.data as { [key: string]: [string] }}
          open={hasError.hasError}
          handleClose={() =>
            setHasError({ hasError: false, errorMessage: null })
          }
        />
      )}

      {isLoading && personIsLoading && areaIsLoading && sampleIsLoading && (
        <TransitionsModal
          description={<CircularProgress />}
          open={isOpen}
          handleClose={() => setIsOpen(false)}
        />
      )}

      {uploadStatus === UPLOAD_STATUS.FAILED && (
        <TransitionsModal
          title="Enter a message before sending it"
          description="Please try to submit the form again"
          errorList={
            messageLogSubmissionError?.data as { [key: string]: [string] }
          }
          showButton
          open={isOpenSubmission}
          handleClose={() => setIsOpenSubmission(false)}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.FAILED ||
        (updateStatus === UPDATE_STATUS.FAILED && (
          <TransitionsModal
            title="An error occurred on the server"
            description="Please try to submit the form again"
            errorList={
              messageLogSubmissionError?.data as { [key: string]: [string] }
            }
            showButton
            open={isOpenSubmission}
            handleClose={() => setIsOpenSubmission(false)}
          />
        ))}

      {updateStatus === UPDATE_STATUS.SAVING ||
        (submissionStatus === SUBMISSION_STATUS.SAVING && (
          <TransitionsModal
            description={<CircularProgress />}
            open={isOpenSubmission}
            handleClose={() => setIsOpenSubmission(false)}
          />
        ))}

      <LogCard
        logMessages={newList}
        attachmentOnClick={(file: File) => handlePPSUpload(file)}
        setData={setData}
        onFormSubmit={(e: FormEvent) => onFormSubmit(e)}
        clearInput={clear}
        setClearInput={setClear}
        atMentionData={atMentionData}
        hashtagMentionData={hashtagMentionData}
        onClickDownload={() =>
          onClickDownload(
            surveyMomentId,
            `Daily log for project: ${record?.title} on ${surveyMomentId.startDate}`,
            false,
          )
        }
        updatedLogMessage={updatedLogMessage}
        handleUpdate={handleUpdate}
        submitUpdatedMessage={submitUpdatedMessage}
        updateState={updateState}
        setUpdateState={setUpdateState}
      />

      {submissionError && (
        <TransitionsModal
          title="There is a error with the server"
          description="Try again to submit the form"
          showButton
          open={isOpenSubmission}
          handleClose={() => setIsOpenSubmission(false)}
        />
      )}

      {submitUpdateError && (
        <TransitionsModal
          title="There is a error with the server"
          description="Try again to submit the update form"
          showButton
          open={isOpenSubmission}
          handleClose={() => setIsOpenSubmission(false)}
        />
      )}
    </>
  );
}
