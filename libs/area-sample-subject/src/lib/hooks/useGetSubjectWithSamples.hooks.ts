import { useEffect, useMemo, useState } from 'react';
import {
  ISampleListItem,
  sampleActions,
  SampleState,
  useGetAllSamplesBySurveyMomentQuery,
} from '@tes/samples';
import {
  IPersonSampleSubjectListItem,
  useGetAllPersonSampleSubjectQuery,
} from '@tes/person-subject-api';
import {
  IAreaSubjectListItem,
  useGetAllAreaSampleSubjectQuery,
} from '@tes/area-subject-api';
import { mapListResult } from '@tes/utils-hooks';
import { useDispatch, useSelector } from 'react-redux';

export enum SUBJECT_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

interface IProps {
  surveyMomentId: {
    project: string;
    startDate: string;
  };
}

export function useGetSubjectWithSamples(props: IProps) {
  const { surveyMomentId } = props;
  const [subjectStatus, setSubjectStatus] = useState<SUBJECT_STATUS>(
    SUBJECT_STATUS.IDLE,
  );
  const dispatch = useDispatch();
  const { updateNeedsRefetch } = sampleActions;
  const needsRefetch = useSelector(
    (state: { sample: SampleState }) => state.sample.needsRefetch,
  );

  const {
    data: sampleData,
    isLoading: sampleIsLoading,
    refetch,
  } = useGetAllSamplesBySurveyMomentQuery(
    {
      surveyMomentId: surveyMomentId,
    },
    { refetchOnMountOrArgChange: true },
  );

  const {
    data: personSubjectData,
    isLoading: personIsLoading,
    refetch: PersonRefetch,
  } = useGetAllPersonSampleSubjectQuery({ surveyMomentId: surveyMomentId });

  const {
    data: areaSubjectData,
    isLoading: areaIsLoading,
    refetch: AreaRefetch,
  } = useGetAllAreaSampleSubjectQuery({ surveyMomentId: surveyMomentId });

  useEffect(() => {
    if (!needsRefetch) {
      return;
    }
    refetch();
    PersonRefetch();
    AreaRefetch();
    dispatch(updateNeedsRefetch({ needsRefetch: false }));
  }, [
    needsRefetch,
    refetch,
    updateNeedsRefetch,
    dispatch,
    PersonRefetch,
    AreaRefetch,
  ]);

  const { itemList: sampleList } = mapListResult(sampleData);

  const formattedAreaSampleList = useMemo(
    () =>
      sampleList.reduce(
        (acc: { [key: string]: Array<ISampleListItem> }, obj) => {
          const key = obj['areaSampleSubject'];
          const curGroup = acc[key] ?? [];

          return { ...acc, [key]: [...curGroup, obj] };
        },
        {},
      ),
    [sampleList],
  );

  const formattedPersonSampleList = useMemo(
    () =>
      sampleList.reduce(
        (acc: { [key: string]: Array<ISampleListItem> }, obj) => {
          const key = obj['personSampleSubject'];
          const curGroup = acc[key] ?? [];

          return { ...acc, [key]: [...curGroup, obj] };
        },
        {},
      ),
    [sampleList],
  );

  const { itemList: areaSubjectList } = mapListResult(areaSubjectData);

  const areaItemList = useMemo(
    () =>
      areaSubjectList.map((item) => {
        return {
          ...item,
          samples: formattedAreaSampleList
            ? formattedAreaSampleList[item.id]
            : [],
        };
      }),
    [areaSubjectList, formattedAreaSampleList],
  );

  const { itemList: personSubjectList } = mapListResult(personSubjectData);

  const personItemList = useMemo(
    () =>
      personSubjectList.map((item) => {
        return {
          ...item,
          samples: formattedPersonSampleList
            ? formattedPersonSampleList[item.id]
            : [],
        };
      }),
    [formattedPersonSampleList, personSubjectList],
  );

  const itemList: Array<IPersonSampleSubjectListItem | IAreaSubjectListItem> =
    useMemo(() => {
      return [...areaItemList, ...personItemList];
    }, [areaItemList, personItemList]);

  useEffect(() => {
    if (subjectStatus === SUBJECT_STATUS.LOADING) {
      return;
    }

    if (!sampleIsLoading) {
      return;
    }

    if (!areaIsLoading) {
      return;
    }

    if (!personIsLoading) {
      return;
    }

    setSubjectStatus(SUBJECT_STATUS.LOADING);
  }, [areaIsLoading, personIsLoading, sampleIsLoading, subjectStatus]);

  useEffect(() => {
    if (subjectStatus === SUBJECT_STATUS.SUCCEEDED) {
      return;
    }

    if (!sampleList) {
      return;
    }

    if (!areaSubjectData) {
      return;
    }

    if (!personSubjectData) {
      return;
    }

    if (!itemList) {
      return;
    }

    setSubjectStatus(SUBJECT_STATUS.SUCCEEDED);
  }, [areaSubjectData, itemList, personSubjectData, sampleList, subjectStatus]);

  return {
    subjectStatus,
    subjectList: itemList,
    refetch,
    sampleData,
  };
}
