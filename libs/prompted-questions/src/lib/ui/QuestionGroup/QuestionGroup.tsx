import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Divider, IconButton, Paper, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react';
import {
  ArrayLayoutProps,
  Layout,
  mapDispatchToCellProps,
  Resolve,
} from '@jsonforms/core';
import {
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

import { QuestionListItem } from '../../widgets/QuestionListItem';
import {
  getItemRegistry,
  isItemData,
  ListContext,
  ListContextValue,
} from '../../hooks';

interface IProps {
  childPath: string;
  deleteConfirm: (path: string) => void;
  handleQuestionDelete: (path: string) => void;
}

export type QuestionGroupProps = IProps & ArrayLayoutProps;

export function QuestionGroup(props: IProps & ArrayLayoutProps) {
  const { core, renderers, cells, dispatch } = useJsonForms();
  const { schema, addItem, childPath, deleteConfirm, handleQuestionDelete } =
    props;
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const groupData = useMemo(
    () => Resolve.data(core?.data, childPath),
    [childPath, core?.data],
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { handleChange } = mapDispatchToCellProps(dispatch);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  const questionsSchema = useMemo(
    () => ({
      type: 'object',
      properties: {
        label: {
          type: 'string',
        },
        kind: {
          type: 'string',
        },
        choices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: {
                type: 'string',
              },
            },
          },
        },
      },
    }),
    [],
  );

  const questionsUiSchema = useMemo(
    () =>
      ({
        type: 'VerticalLayout',
        elements: [
          {
            type: 'Control',
            label: 'Whats your Question?',
            scope: '#/properties/label',
          },
          {
            type: 'Control',
            label: 'What are the choices?',
            scope: '#/properties/choices',
            rule: {
              effect: 'HIDE',
              condition: {
                scope: '#/properties/kind',
                schema: {
                  const: 'text',
                },
              },
            },
          },
        ],
      } as unknown as Layout),
    [],
  );

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];

        if (!destination) {
          return;
        }

        const sourceElement = source.element;

        const sourceElementType = sourceElement.getAttribute('data-type');
        const groupIndex = destination.element.getAttribute('data-group-index');

        if (groupIndex !== childPath) {
          return;
        }

        if (!sourceElementType) {
          return;
        }

        addItem(`${groupIndex}.questions`, { kind: sourceElementType })();

        return;
      },
    });
  }, [addItem, childPath, questionsSchema]);

  const uiSchema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/title',
      },
      {
        type: 'Control',
        label: 'Ask these questions across all projects, one time',
        scope: '#/properties/isRequiredForNewProjects',
      },
      {
        type: 'Control',
        label: 'Ask these questions:',
        scope: '#/properties/repeatEverySurveyMoment',
        options: {
          format: 'radio',
        },
      },
    ],
  };

  const handleQuestionListChange = useCallback(
    (itemList: Array<{ kind: string }>) => {
      if (!itemList) return;
      if (!childPath) return;

      handleChange(`${childPath}.questions`, itemList);
    },
    [childPath, handleChange],
  );

  const numberOfQuestions: Array<{ kind: string }> = Resolve.data(
    core?.data,
    `${childPath}.questions`,
  );

  const [itemList, setItemList] = useState<Array<{ kind: string }>>([]);
  const [registry] = useState(getItemRegistry);
  const [instanceId] = useState(() => Symbol('instance-id'));

  useEffect(() => {
    if (!numberOfQuestions) return;
    if (!numberOfQuestions.length) return;

    setItemList(numberOfQuestions);
  }, [numberOfQuestions]);

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
        const reOrderedList = reorder({
          list: listState,
          startIndex,
          finishIndex,
        });
        handleQuestionListChange(reOrderedList);
        return reOrderedList;
      });
    },
    [handleQuestionListChange],
  );

  useEffect(() => {
    return autoScrollWindowForElements({
      canScroll: ({ source }) =>
        isItemData(source.data) && source.data.instanceId === instanceId,
    });
  }, [instanceId]);

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
          (item, index) =>
            `${item.kind}-${index}` ===
            `${
              (targetData as { item: { kind: string; index: number } }).item
                .kind
            }-${targetData.index}`,
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

  return (
    <ListContext.Provider value={contextValue}>
      <Paper sx={{ mb: 2 }}>
        <Box
          sx={{
            backgroundColor: '#535063',
            py: 2,
            px: 4,
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h5">
            {groupData && groupData.title
              ? groupData.title
              : 'Fill in the group title'}
          </Typography>

          <IconButton
            sx={{
              width: 40,
              height: 40,
            }}
            onClick={() => deleteConfirm(childPath)}
          >
            <DeleteIcon sx={{ color: '#fff' }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            minHeight: 150,
            backgroundColor: isDraggedOver ? '#f1f6f7' : 'inherit',
            p: 2,
          }}
          ref={ref}
          data-group-index={childPath}
        >
          <Box sx={{ px: 2 }}>
            <Typography variant="h6">Group configuration</Typography>

            <JsonFormsDispatch
              enabled={true}
              schema={schema}
              uischema={uiSchema}
              path={childPath}
              renderers={renderers}
              cells={cells}
            />
          </Box>
          <Divider sx={{ my: 4 }} />
          {itemList &&
            itemList.map((item, index: number) => (
              <QuestionListItem
                key={`key_${item.kind}_${index}`}
                item={item}
                index={index}
                handleQuestionDelete={() =>
                  handleQuestionDelete(`${childPath}.questions.${index}`)
                }
                path={`${childPath}.questions.${index}`}
                questionsSchema={questionsSchema}
                questionsUISchema={questionsUiSchema}
              />
            ))}
          <Box>Drop your question here</Box>
        </Box>
      </Paper>
    </ListContext.Provider>
  );
}
