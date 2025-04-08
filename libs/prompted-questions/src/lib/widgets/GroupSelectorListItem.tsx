import { Box, Checkbox, TableCell, TableRow } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IItem } from './GroupSelectorWidget';
import invariant from 'tiny-invariant';

import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { token } from '@atlaskit/tokens';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import ReactDOM from 'react-dom';
import { getItemData, isItemData, useListContext } from '../hooks';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { QuestionGroupTypeChip } from '../ui';
import * as colors from '@tes/ui/colors';

type DraggableState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'dragging' };

const idleState: DraggableState = { type: 'idle' };
const draggingState: DraggableState = { type: 'dragging' };

export function GroupSelectorListItem({
  item,
  index,
  selectedItems,
  onToggleSelect,
  enabled,
}: {
  item: IItem;
  index: number;
  selectedItems: Set<string>;
  onToggleSelect: (
    value: string,
    isSelected: boolean,
    sourceIndex: number,
  ) => void;
  enabled: boolean;
}) {
  const { registerItem, instanceId } = useListContext();

  const ref = useRef<HTMLDivElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const dragHandleRef = useRef<HTMLButtonElement>(null);

  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState);

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef.current;
    invariant(element);
    invariant(dragHandle);

    const data = getItemData({ item, index, instanceId });

    return combine(
      registerItem({ itemId: item.const, element }),
      draggable({
        element: dragHandle,
        getInitialData: () => data,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: token('space.200', '16px'),
              y: token('space.100', '8px'),
            }),
            render({ container }) {
              setDraggableState({ type: 'preview', container });

              return () => setDraggableState(draggingState);
            },
          });
        },
        onDragStart() {
          setDraggableState(draggingState);
        },
        onDrop() {
          setDraggableState(idleState);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            isItemData<IItem>(source.data) &&
            source.data.instanceId === instanceId
          );
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDrag({ self, source }) {
          const isSource = source.element === element;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data['index'];
          invariant(typeof sourceIndex === 'number');

          const isItemBeforeSource = index === sourceIndex - 1;
          const isItemAfterSource = index === sourceIndex + 1;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === 'bottom') ||
            (isItemAfterSource && closestEdge === 'top');

          if (isDropIndicatorHidden) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      }),
    );
  }, [instanceId, item, index, registerItem]);

  const tableRowStyle = useMemo(() => {
    if (!closestEdge) {
      return { border: 'none' };
    }

    if (closestEdge === 'top') {
      return { borderTop: '2px solid grey' };
    } else {
      return { borderBottom: '2px solid grey' };
    }
  }, [closestEdge]);

  return (
    <>
      <TableRow component="div" ref={ref} sx={tableRowStyle}>
        <TableCell component="div">
          <DragHandleButton
            ref={dragHandleRef}
            label={`Reorder ${item.title}`}
          />
        </TableCell>
        <TableCell
          component="div"
          padding="checkbox"
          sx={{ borderRight: '1px solid #e0e0e0' }}
        >
          <Checkbox
            disabled={!enabled || item.isRequiredForNewProjects}
            checked={
              selectedItems.has(item.const) || item.isRequiredForNewProjects
            }
            onChange={(_event, isSelected) =>
              onToggleSelect(item.const, isSelected, index)
            }
          />
        </TableCell>
        <TableCell component="div">{item.title}</TableCell>
        <TableCell component="div">
          <Box sx={{ display: 'flex', gap: 2 }}>
            {item.isRequiredForNewProjects && (
              <QuestionGroupTypeChip
                label="Persistent"
                backgroundColor={colors.accent1['300']}
                color={colors.accent1['900']}
              />
            )}
            {item.repeatEverySurveyMoment && (
              <QuestionGroupTypeChip
                label="Daily"
                backgroundColor={colors.accent2['100']}
                color={colors.accent2['900']}
              />
            )}
          </Box>
        </TableCell>
      </TableRow>
      {draggableState.type === 'preview' &&
        ReactDOM.createPortal(
          <TableRow sx={{ backgroundColor: '#fff' }} component="div">
            <TableCell
              component="div"
              padding="checkbox"
              sx={{ borderRight: '1px solid #e0e0e0' }}
            >
              <Checkbox
                disabled={!enabled}
                checked={selectedItems.has(item.const)}
              />
            </TableCell>
            <TableCell component="div">{item.title}</TableCell>
          </TableRow>,
          draggableState.container,
        )}
    </>
  );
}
