import {
  IResultsByClient,
  useGetAllClientsQuery,
  useGetAllResultsByClientQuery,
} from '../api';
import { mapListResult } from '@tes/utils-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

export function subtractMonths(date: Date, months: number) {
  date.setMonth(date.getMonth() - months);

  return date;
}

export enum RESULT_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useOELResultsByClient() {
  const [status, setStatus] = useState<RESULT_STATUS>(RESULT_STATUS.IDLE);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const initialStartDate = subtractMonths(new Date(), 6);

  const [startDate, setStartDate] = useState<Dayjs>(dayjs(initialStartDate));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(new Date()));
  const [clients, setClients] = useState<Array<string>>([]);

  const handleFullScreen = useCallback((value: boolean) => {
    setIsFullscreen(value);
  }, []);

  const handleStartDate = useCallback((value: Dayjs) => {
    setStartDate(value);
  }, []);

  const handleEndDate = useCallback((value: Dayjs) => {
    setEndDate(value);
  }, []);

  const {
    data: resultData,
    isLoading,
    isError,
    isSuccess,
  } = useGetAllResultsByClientQuery({
    startDate: startDate?.format('YYYY-MM-DD'),
    endDate: endDate?.format('YYYY-MM-DD'),
  });

  const onToggleSelectBarChartClients = (id: string) => {
    let newSelection = [...clients];

    if (newSelection.includes(id)) {
      newSelection = newSelection.filter((item) => item !== id);
    } else {
      newSelection.push(id);
    }

    setClients(newSelection);
  };

  const {
    data: clientData,
    isLoading: clientLoading,
    isError: clientError,
    isSuccess: clientSuccess,
  } = useGetAllClientsQuery();

  const { itemList: clientList } = mapListResult(clientData);

  useEffect(() => {
    if (isLoading || clientLoading) {
      return setStatus(RESULT_STATUS.LOADING);
    }
    if (isError || clientError) {
      return setStatus(RESULT_STATUS.FAILED);
    }

    if (!resultData && !clientData) {
      return setStatus(RESULT_STATUS.FAILED);
    }

    return setStatus(RESULT_STATUS.SUCCEEDED);
  }, [
    clientData,
    clientError,
    clientLoading,
    clientSuccess,
    isError,
    isLoading,
    isSuccess,
    resultData,
  ]);

  const getResultData = useCallback(
    (
      clientResultItem: IResultsByClient,
      chartClientData: Map<string, Array<number>>,
    ) => {
      clientResultItem.results.forEach((item) => {
        const resultList = chartClientData.get(item.id);
        if (resultList) {
          resultList?.push(item.value);
        } else {
          chartClientData.set(item.id, [item.value]);
        }
      });

      return chartClientData;
    },
    [],
  );

  const getResultColors = useCallback(
    (
      clientResultItem: IResultsByClient,
      chartClientColors: Map<string, string>,
    ) => {
      clientResultItem.results.forEach((item) => {
        chartClientColors.set(item.id, item.color);
      });

      return chartClientColors;
    },
    [],
  );

  const chartData = useMemo(() => {
    const chartClientList: Map<string, string> = new Map();
    const chartClientData: Map<string, Array<number>> = new Map();
    const chartClientColors: Map<string, string> = new Map();

    if (status !== RESULT_STATUS.SUCCEEDED) {
      return null;
    }

    if (!resultData) {
      return null;
    }

    clientList.forEach((client) => {
      const clientResultsData = resultData.find(
        (item) => item.id === client.id,
      );
      if (clientResultsData) {
        getResultData(clientResultsData, chartClientData);
        getResultColors(clientResultsData, chartClientColors);
        chartClientList.set(client.id, client.title);
      }
    });

    return {
      clientList: chartClientList,
      clientResults: chartClientData,
      clientResultsColors: chartClientColors,
    };
  }, [clientList, getResultColors, getResultData, resultData, status]);

  return {
    status,
    chartData,
    clientList,

    isFullscreen,
    handleFullScreen,

    startDate,
    handleStartDate,

    endDate,
    handleEndDate,

    clients,
    onToggleSelectBarChartClients,
  };
}
