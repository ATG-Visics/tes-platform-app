import {
  UseMutation,
  UseQuery,
} from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
  QueryDefinition,
} from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useState } from 'react';

interface IProps<TagTypes extends string, ReducerPath extends string> {
  useStartMutation: UseMutation<
    MutationDefinition<
      { project: string; startDate?: string } | string,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      TagTypes,
      { taskId: string; status: string },
      ReducerPath
    >
  >;
  useStatusQuery: UseQuery<
    QueryDefinition<
      | { taskId: string; uuid: string; fileName: string }
      | { taskId: string; fileName: string },
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      TagTypes,
      { status: string; downloadUrl: string; error: string } | unknown,
      ReducerPath
    >
  >;
}

export enum DOWNLOAD_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useDownloadHooks<
  TagTypes extends string,
  ReducerPath extends string,
>(props: IProps<TagTypes, ReducerPath>) {
  const { useStartMutation, useStatusQuery } = props;
  const [downloadStatus, setDownloadStatus] = useState<DOWNLOAD_STATUS>(
    DOWNLOAD_STATUS.IDLE,
  );
  const [startPolling, setStartPolling] = useState<{
    polling: boolean;
    taskID: string;
  }>({ polling: false, taskID: '' });
  const [downloadError, setDownloadError] = useState('');
  const [exportDetails, setExportDetails] = useState<{
    isDetail: boolean;
    id: string;
    fileName: string;
  }>({ isDetail: false, id: '', fileName: '' });

  const [startDownload] = useStartMutation();

  const { data: apiData, isError } = useStatusQuery(
    exportDetails.isDetail
      ? {
          uuid: exportDetails.id,
          taskId: startPolling.taskID,
          fileName: exportDetails.fileName,
        }
      : { taskId: startPolling.taskID, fileName: exportDetails.fileName },
    { skip: !startPolling.polling, pollingInterval: 1000 },
  );

  const data = apiData as unknown as {
    status: string;
    downloadUrl: string;
    error: string;
  };

  useEffect(() => {
    if (isError) {
      setStartPolling({ polling: false, taskID: '' });
      setDownloadStatus(DOWNLOAD_STATUS.FAILED);
    }

    if (data && data.status === 'failed') {
      setStartPolling({ polling: false, taskID: '' });
      setDownloadStatus(DOWNLOAD_STATUS.FAILED);
      setDownloadError(`${data?.error}`);
    }

    if (data && data.status === 'completed') {
      setStartPolling({ polling: false, taskID: '' });
      setDownloadStatus(DOWNLOAD_STATUS.SUCCEEDED);
    }
  }, [data, isError]);

  const onClickDownload = useCallback(
    (
      id:
        | string
        | {
            project: string;
            startDate?: string;
            fromDate?: string;
            toDate?: string;
          },
      fileName: string,
      isDetail?: boolean,
    ) => {
      setDownloadStatus(DOWNLOAD_STATUS.LOADING);
      if (isDetail) {
        setExportDetails({
          isDetail: true,
          id: typeof id === 'string' ? id : id.project,
          fileName,
        });
      } else {
        setExportDetails({ isDetail: false, id: '', fileName });
      }
      startDownload(id)
        .unwrap()
        .then(
          (successData) => {
            setStartPolling({ polling: true, taskID: successData.taskId });
          },
          (error) => {
            setDownloadStatus(DOWNLOAD_STATUS.FAILED);
            const errorMessage =
              error.originalStatus === 500
                ? 'There has been a internal error on the server'
                : error;
            setDownloadError(errorMessage);
          },
        );
    },
    [startDownload],
  );

  return {
    onClickDownload,
    downloadStatus,
    downloadError,
  };
}
