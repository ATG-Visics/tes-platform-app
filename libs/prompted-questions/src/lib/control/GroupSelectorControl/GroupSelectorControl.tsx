import {
  ControlProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { useMemo } from 'react';
import { useGetQuestionGroupByAccountQuery } from '../../api';
import { mapListResult } from '@tes/utils-hooks';
import { GroupSelectorLayout } from '../../widgets/GroupSelectorLayoutControl';

export function GroupSelectorControl(props: ControlProps) {
  const { uischema, data, path } = props;

  const { data: groupData } = useGetQuestionGroupByAccountQuery({});
  const { itemList } = mapListResult(groupData);

  const isStatic = useMemo(
    () => uischema.options && uischema.options['static'],
    [uischema.options],
  );

  const filteredItemList = useMemo(() => {
    if (isStatic) {
      return itemList.filter((item) => !item.repeatEverySurveyMoment);
    } else {
      return itemList.filter((item) => item.repeatEverySurveyMoment);
    }
  }, [itemList, isStatic]);

  const formattedItemList = useMemo(
    () =>
      filteredItemList?.map((item) => ({
        const: item.id,
        title: item.title,
        isRequiredForNewProjects: item.isRequiredForNewProjects,
        repeatEverySurveyMoment: item.repeatEverySurveyMoment,
      })),
    [filteredItemList],
  );

  const localData = useMemo(() => {
    const dataObjects = filteredItemList?.filter((item) =>
      data?.includes(item.id),
    );

    const isPersistentObjects = filteredItemList?.filter(
      (item) => item.isRequiredForNewProjects,
    );

    const newItemList = new Set([...dataObjects, ...isPersistentObjects]);
    return [...newItemList.values()].map((item) => item.id);
  }, [data, filteredItemList]);

  return (
    <GroupSelectorLayout
      {...props}
      items={formattedItemList}
      data={localData}
      path={path}
    />
  );
}

export const GroupSelectorControlTester: RankedTester = rankWith(
  30,
  uiTypeIs('GroupSelectorControl'),
);

export const GroupSelectorControlRenderer =
  withJsonFormsControlProps(GroupSelectorControl);
