import {
  Checkbox,
  Table as TableComponent,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';
import {
  getItemRegistry,
  isItemData,
  ListContext,
  ListContextValue,
} from '../hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { GroupSelectorListItem } from './GroupSelectorListItem';

export interface IItem {
  const: string;
  title: string;
  isRequiredForNewProjects: boolean;
  repeatEverySurveyMoment: string;
}

interface IProps {
  items: IItem[];
  selectedItems: Set<string>;
  isIndeterminate: boolean;
  isAllChecked: boolean;
  onToggleSelectAll: SwitchBaseProps['onChange'];
  onToggleSelect: (value: string, isSelected: boolean) => void;
  reOrderdItemList: (itemList: Array<IItem>) => void;
  enabled: boolean;
  data: Array<string>;
}

export type GroupSelectorWidgetProps = IProps;

export function GroupSelectorWidget(props: IProps) {
  const {
    items: defaultItems,
    onToggleSelect,
    selectedItems,
    reOrderdItemList,
    enabled,
  } = props;

  const [itemList, setItemList] = useState<IItem[]>([]);
  const [registry] = useState(getItemRegistry);
  const [instanceId] = useState(() => Symbol('instance-id'));

  useEffect(() => {
    if (itemList.length > 1) {
      return;
    }

    setItemList(defaultItems);
  }, [defaultItems, itemList.length, reOrderdItemList]);

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: Edge | null;
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: 'vertical',
      });

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return;
      }

      setItemList((listState) => {
        const newOrderdList = reorder({
          list: listState,
          startIndex,
          finishIndex,
        });
        reOrderdItemList(newOrderdList);
        return newOrderdList;
      });
    },
    [reOrderdItemList],
  );

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isItemData(source.data) && source.data.instanceId === instanceId;
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;
        if (!isItemData(sourceData) || !isItemData(targetData)) {
          return;
        }

        const indexOfTarget = itemList.findIndex(
          (item) => item.const === (targetData as { item: IItem }).item.const,
        );

        if (indexOfTarget < 0) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        reorderItem({
          startIndex: sourceData.index,
          indexOfTarget,
          closestEdgeOfTarget,
        });
      },
    });
  }, [instanceId, itemList, reorderItem]);

  const getListLength = useCallback(() => itemList.length, [itemList.length]);

  const contextValue: ListContextValue = useMemo(() => {
    return {
      registerItem: registry.register,
      reorderItem,
      instanceId,
      getListLength,
    };
  }, [registry.register, reorderItem, instanceId, getListLength]);

  // TODO Fix the moveToTop so if you select a item it goes to the top
  // const moveToTop = useCallback((sourceIndex: number) => {
  //   reorderItem({
  //     startIndex: sourceIndex,
  //     indexOfTarget: data.length,
  //     closestEdgeOfTarget: null,
  //   });
  // }, [data.length, reorderItem]);

  return (
    <ListContext.Provider value={contextValue}>
      <TableContainer style={{ marginTop: 64 }}>
        <TableComponent component="div" sx={{ minWidth: 500 }}>
          <TableHead
            component="div"
            aria-labelledby="group-selector"
            aria-label="group-selector"
          >
            <TableRow component="div">
              <TableCell padding="checkbox" component="div">
                <Typography fontSize="inherit" fontWeight="600">
                  Ordering
                </Typography>
              </TableCell>
              <TableCell
                component="div"
                padding="checkbox"
                sx={{ borderRight: '1px solid #e0e0e0' }}
              ></TableCell>
              <TableCell component="div">
                <Typography fontSize="inherit" fontWeight="600">
                  Question groups
                </Typography>
              </TableCell>
              <TableCell component="div">
                <Typography fontSize="inherit" fontWeight="600">
                  Group type
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody component="div" sx={{ transition: 'opacity .5s' }}>
            {itemList ? (
              itemList.map((item: IItem, index) => (
                <GroupSelectorListItem
                  enabled={enabled}
                  selectedItems={selectedItems}
                  onToggleSelect={onToggleSelect}
                  item={item}
                  index={index}
                  key={item.const}
                />
              ))
            ) : (
              <TableRow component="div">
                <TableCell
                  component="div"
                  padding="checkbox"
                  sx={{ borderRight: '1px solid #e0e0e0' }}
                >
                  <Checkbox />
                </TableCell>
                <TableCell>Add Questions to the account</TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </TableContainer>
    </ListContext.Provider>
  );
}

// Inhoud van de tablRow
