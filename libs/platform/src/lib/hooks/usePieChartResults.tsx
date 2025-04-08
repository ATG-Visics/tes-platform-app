import { useCallback, useMemo, useState } from 'react';
import {
  useGetAllHazardsQuery,
  useGetClientsByHazardQuery,
  useGetResultsByHazardQuery,
} from '../api';
import dayjs, { Dayjs } from 'dayjs';
import { subtractMonths } from './useOELResultsByClient';

const casNumberCheck = (value: string) => {
  if (value === undefined || value === '0000-0000-0000' || value === '') {
    return '';
  }

  return `- # ${value}`;
};

export function usePieChartResults() {
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [filterData, setFilterData] = useState<{
    clients: Array<string>;
    sampleType: Array<string>;
  }>({ clients: [], sampleType: [] });

  const initialStartDate = subtractMonths(new Date(), 6);

  const [startDate, setStartDate] = useState<Dayjs>(dayjs(initialStartDate));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(new Date()));

  const handleStartDate = useCallback((value: Dayjs) => {
    setStartDate(value);
  }, []);

  const handleEndDate = useCallback((value: Dayjs) => {
    setEndDate(value);
  }, []);

  const toggleOpen = useCallback((value: boolean) => setOpen(value), []);

  const { data: constituentList } = useGetAllHazardsQuery(
    {
      searchTitle: inputValue,
    },
    { skip: !open },
  );

  const formattedHazardList = useMemo(() => {
    if (!constituentList) {
      return [];
    }

    return constituentList?.map((item) => ({
      label: `${item.title} ${casNumberCheck(item.casNumber)}`,
      value: item.id,
    }));
  }, [constituentList]);

  const foundDataItem = useMemo(() => {
    if (!selectValue) {
      return null;
    }

    return constituentList?.find((item) => item.id === selectValue);
  }, [constituentList, selectValue]);

  const findOption =
    !open && foundDataItem
      ? {
          value: foundDataItem.id,
          label: `${foundDataItem.title} ${casNumberCheck(
            foundDataItem.casNumber,
          )}`,
        }
      : null;

  const hazardResponse = useGetResultsByHazardQuery(
    {
      hazard: selectValue,
      filters: filterData,
      startDate: startDate?.format('YYYY-MM-DD'),
      endDate: endDate?.format('YYYY-MM-DD'),
    },
    { skip: !selectValue },
  );
  const { data: clientResponse } = useGetClientsByHazardQuery(selectValue, {
    skip: !selectValue,
  });

  const onToggleSelectClients = (id: string) => {
    let newSelection = [...filterData.clients];

    if (newSelection.includes(id)) {
      newSelection = newSelection.filter((item) => item !== id);
    } else {
      newSelection.push(id);
    }

    setFilterData((prevState) => ({ ...prevState, clients: newSelection }));
  };

  const onToggleSelectSampleType = (id: string) => {
    let newSelection = [...filterData.sampleType];

    if (newSelection.includes(id)) {
      newSelection = newSelection.filter((item) => item !== id);
    } else {
      newSelection.push(id);
    }

    setFilterData((prevState) => ({ ...prevState, sampleType: newSelection }));
  };

  return {
    setSelectValue,

    inputValue,
    setInputValue,

    toggleOpen,

    formattedHazardList,
    findOption,
    hazardResponse,
    clientResponse,

    onToggleSelectClients,
    onToggleSelectSampleType,

    startDate,
    handleStartDate,

    endDate,
    handleEndDate,
  };
}
