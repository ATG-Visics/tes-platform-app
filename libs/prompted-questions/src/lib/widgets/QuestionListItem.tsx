import { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react';
import { JsonSchema7, UISchemaElement } from '@jsonforms/core';

import { Box, IconButton, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { token } from '@atlaskit/tokens';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import { getItemData, isItemData, useListContext } from '../hooks';

const questionKind = (kind: string) => {
  switch (kind) {
    case 'text': {
      return 'Free text';
    }
    case 'radio': {
      return 'Radio';
    }
    case 'checkboxes': {
      return 'Checkbox';
    }
    case 'select': {
      return 'Select';
    }
    case 'select_with_other': {
      return 'Select with other';
    }
    default: {
      return 'Free text';
    }
  }
};

type DraggableState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'dragging' };

const idleState: DraggableState = { type: 'idle' };
const draggingState: DraggableState = { type: 'dragging' };

interface IProps {
  item: { kind: string };
  index: number;
  handleQuestionDelete: () => void;
  path: string;
  questionsSchema: JsonSchema7;
  questionsUISchema: UISchemaElement;
}

export function QuestionListItem(props: IProps) {
  const { renderers, cells } = useJsonForms();
  const {
    item,
    index,
    handleQuestionDelete,
    path,
    questionsSchema,
    questionsUISchema,
  } = props;
  const { registerItem, instanceId } = useListContext();

  const ref = useRef<HTMLDivElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    const data = getItemData({ item, index, instanceId });

    return combine(
      registerItem({ itemId: `${item.kind}-${index}`, element }),
      draggable({
        element: element,
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
            isItemData(source.data) && source.data.instanceId === instanceId
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
      return { borderTop: '2px solid grey', borderRadius: 0 };
    } else {
      return { borderBottom: '2px solid grey', borderRadius: 0 };
    }
  }, [closestEdge]);

  return (
    <>
      <Box
        sx={[
          {
            mb: 2,
            boxShadow:
              '0px 2px 1px -1px rgb(0 0 0 / 1%),0px 1px 1px 0px rgb(0 0 0 / 14%),0px 1px 3px 0px rgb(0 0 0 / 12%)',
            borderRadius: '4px',
            p: 2,
            cursor: 'grab',
            '&:hover': {
              backgroundColor: '#f9f9f9',
            },
          },
          tableRowStyle,
        ]}
        ref={ref}
        key={`key_${item.kind}_${index}`}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body1" key={`${index}`}>
            {questionKind(item.kind)} Question
          </Typography>
          <IconButton onClick={handleQuestionDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>

        <JsonFormsDispatch
          enabled={true}
          schema={questionsSchema}
          uischema={questionsUISchema}
          path={path}
          renderers={renderers}
          cells={cells}
        />
      </Box>
      {draggableState.type === 'preview' &&
        ReactDOM.createPortal(
          <Box
            sx={{
              backgroundColor: '#f9f9f9',
              px: 1,
              py: 3,
              boxShadow:
                '0px 2px 1px -1px rgb(0 0 0 / 1%),0px 1px 1px 0px rgb(0 0 0 / 14%),0px 1px 3px 0px rgb(0 0 0 / 12%)',
              borderRadius: '4px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Typography variant="body1" key={`${index}`}>
                {questionKind(item.kind)} Question
              </Typography>
            </Box>
          </Box>,
          draggableState.container,
        )}
    </>
  );
}
