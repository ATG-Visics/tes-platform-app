import { ControlProps } from '@jsonforms/core';
import { BaseInputControl } from '@tes/jsonforms-extensions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useGetGroupAnswerCheckQuery,
  useRemoveIsHiddenFlagMutation,
  useSetGroupAnswerHiddenMutation,
} from '../api';
import { GroupSelectorWidget, IItem } from './GroupSelectorWidget';
import { useParams } from 'react-router-dom';
import { Box, Button, Fade, Modal, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { RECORD_STATUS } from '@tes/utils-hooks';

export function GroupSelectorLayout(props: ControlProps & { items: IItem[] }) {
  const { handleChange, path, data, items } = props;
  const { id: projectId } = useParams();
  const [groupItem, setGroupItem] = useState<string | null>(null);
  const [groupHasItems, setGroupHasItems] = useState<boolean>(false);
  const [status, setStatus] = useState<RECORD_STATUS>(RECORD_STATUS.IDLE);
  const [apiData, setApiData] = useState<number | null>(null);

  const {
    data: groupAnswerData = null,
    isSuccess,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useGetGroupAnswerCheckQuery(
    { uuid: groupItem !== null ? groupItem : '', project: projectId },
    { skip: !projectId || !groupItem },
  );

  const [setIsHidden] = useSetGroupAnswerHiddenMutation();
  const [removeIdHidden] = useRemoveIsHiddenFlagMutation();

  useEffect(() => {
    if (isSuccess) {
      return setStatus(RECORD_STATUS.SUCCEEDED);
    }

    if (isLoading) {
      setApiData(null);
      return setStatus(RECORD_STATUS.LOADING);
    }
    if (isFetching) {
      setApiData(null);
      return setStatus(RECORD_STATUS.LOADING);
    }

    if (isError) {
      return setStatus(RECORD_STATUS.FAILED);
    }

    return setStatus(RECORD_STATUS.IDLE);
  }, [isError, isFetching, isLoading, isSuccess]);

  const selectedItems = useMemo(() => new Set(data), [data]);

  const isIndeterminate =
    selectedItems.size > 0 && selectedItems.size < items.length;
  const isAllChecked =
    selectedItems.size > 0 && selectedItems.size === items.length;

  const onToggleSelectAll = useCallback(() => {
    if (isIndeterminate || isAllChecked) {
      return;
    }

    handleChange(
      path,
      items.map((item) => item.const),
    );
  }, [handleChange, isAllChecked, isIndeterminate, items, path]);

  const handleRefetch = useCallback(
    (value: string) => {
      if (status !== RECORD_STATUS.IDLE) {
        return;
      }

      if (value !== groupItem) {
        return;
      }

      refetch();
    },
    [groupItem, refetch, status],
  );

  const onToggleSelect = useCallback(
    (value: string, isSelected: boolean) => {
      const newSelectedItems = new Set(selectedItems);

      if (isSelected) {
        removeIdHidden({ project: projectId, uuid: value });
        newSelectedItems.add(value);
      } else {
        setGroupItem(value);
        newSelectedItems.delete(value);
        handleRefetch(value);
      }

      handleChange(path, [...newSelectedItems.values()]);
    },
    [
      handleChange,
      handleRefetch,
      path,
      projectId,
      removeIdHidden,
      selectedItems,
    ],
  );

  const removeItemWithZeroAnswers = useCallback(
    (value: string) => {
      const newSelectedItems = new Set(selectedItems);
      newSelectedItems.delete(value);
      handleChange(path, [...newSelectedItems.values()]);
      setStatus(RECORD_STATUS.IDLE);
      setGroupItem(value);
    },
    [handleChange, path, selectedItems],
  );

  const itemWithAnswers = useCallback(
    (value: string) => {
      setGroupHasItems(true);
      const newSelectedItems = new Set(selectedItems);
      newSelectedItems.add(value);
      handleChange(path, [...newSelectedItems.values()]);
      setStatus(RECORD_STATUS.IDLE);
    },
    [handleChange, path, selectedItems],
  );

  useEffect(() => {
    if (status !== RECORD_STATUS.SUCCEEDED) {
      return;
    }

    if (groupItem === null) {
      return;
    }

    if (groupAnswerData === null) {
      return;
    }

    setApiData(groupAnswerData.count);
  }, [
    groupAnswerData,
    groupItem,
    itemWithAnswers,
    removeItemWithZeroAnswers,
    status,
  ]);

  useEffect(() => {
    if (status !== RECORD_STATUS.SUCCEEDED) {
      return;
    }

    if (groupItem === null) {
      return;
    }

    if (apiData === null) {
      return;
    }

    if (apiData === 0) {
      removeItemWithZeroAnswers(groupItem);
      setApiData(null);
    } else {
      itemWithAnswers(groupItem);
      setApiData(null);
    }
  }, [groupItem, itemWithAnswers, apiData, removeItemWithZeroAnswers, status]);

  const confirmGroupRemoval = useCallback(() => {
    if (!groupItem) return;

    setIsHidden({ project: projectId, uuid: groupItem })
      .unwrap()
      .then(
        (_success) => {
          const newSelectedItems = new Set(selectedItems);
          newSelectedItems.delete(groupItem);
          handleChange(path, [...newSelectedItems.values()]);
        },
        (error) => {
          console.log('Error', error);
        },
      );
    setGroupHasItems(false);
    setStatus(RECORD_STATUS.IDLE);
  }, [groupItem, handleChange, path, projectId, selectedItems, setIsHidden]);

  const reOrderedItemList = useCallback(
    (itemList: Array<IItem>) => {
      handleChange(
        path,
        itemList
          .filter((item) => selectedItems.has(item.const))
          .map((item) => item.const),
      );
    },
    [handleChange, path, selectedItems],
  );

  useEffect(() => {
    if (!items?.length || !data?.length) {
      return;
    }

    const availableItems = new Set(items.map((item) => item.const));
    const cleanedItems = data.filter((item: string) =>
      availableItems.has(item),
    );

    if (cleanedItems.length !== data.length) {
      handleChange(path, cleanedItems);
    }
  }, [data, handleChange, items, path]);

  return (
    <>
      {groupHasItems && isSuccess && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={groupHasItems}
          onClose={() => setGroupHasItems(false)}
          closeAfterTransition
        >
          <Fade in={groupHasItems}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: '40px',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Are you sure you want to disable the group
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                There are{' '}
                <Box
                  component="span"
                  sx={{ display: 'inline' }}
                  fontWeight="bold"
                >
                  {groupAnswerData?.count}
                </Box>{' '}
                answers given to this group, in this project.
              </Typography>
              <Box mb={4} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Button
                  sx={{ mr: 2 }}
                  variant="contained"
                  onClick={() => {
                    setGroupHasItems(false);
                    setApiData(null);
                    setStatus(RECORD_STATUS.IDLE);
                    setGroupItem(null);
                  }}
                >
                  <FormattedMessage
                    id="modal.button.fullscreenClosed"
                    defaultMessage="Close"
                  />
                </Button>
                <Button variant="contained" onClick={confirmGroupRemoval}>
                  <FormattedMessage
                    id="modal.button.fullscreenClosed"
                    defaultMessage="Confirm"
                  />
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
      <BaseInputControl
        {...props}
        items={items}
        errors={''}
        onToggleSelect={onToggleSelect}
        onToggleSelectAll={onToggleSelectAll}
        selectedItems={selectedItems}
        isIndeterminate={isIndeterminate}
        isAllChecked={isAllChecked}
        input={GroupSelectorWidget}
        reOrderdItemList={reOrderedItemList}
      />
    </>
  );
}
