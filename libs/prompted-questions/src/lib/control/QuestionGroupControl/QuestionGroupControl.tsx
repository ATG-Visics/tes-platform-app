import {
  ArrayLayoutProps,
  createDefaultValue,
  Paths,
  rankWith,
  Resolve,
  uiTypeIs,
} from '@jsonforms/core';
import { useJsonForms, withJsonFormsArrayLayoutProps } from '@jsonforms/react';
import { Box, Button } from '@mui/material';
import { QuestionGroup } from '../../ui/QuestionGroup';
import { useCallback, useState } from 'react';
import {
  useDeleteQuestionGroupMutation,
  useDeleteQuestionMutation,
} from '../../api';
import { TransitionsModal } from '@tes/ui/core';
import { ISubmissionError } from '../../hooks';
import { useParams } from 'react-router-dom';
import { ConfirmDeleteDialog } from '../../ui/ConfirmDeleteDialog';
import { useCustomNavigate } from '@tes/router';

function QuestionsGroupControl(props: ArrayLayoutProps) {
  const { data: numberOfItems, addItem, path, removeItems } = props;
  const { core } = useJsonForms();
  const { navigateToRoute } = useCustomNavigate();

  const [open, setOpen] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [submissionError, setSubmissionError] =
    useState<null | ISubmissionError>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    setHasError(false);
  }, []);

  const [questionDelete, setQuestionDelete] = useState({
    isOpen: false,
    path: '',
  });
  const [groupDelete, setGroupDelete] = useState({ isOpen: false, path: '' });

  const handleQuestionDeleteClose = useCallback(
    () => setQuestionDelete({ isOpen: false, path: '' }),
    [],
  );
  const handleGroupDeleteClose = useCallback(
    () => setGroupDelete({ isOpen: false, path: '' }),
    [],
  );

  const [deleteItem] = useDeleteQuestionGroupMutation();
  const [deleteQuestionItem] = useDeleteQuestionMutation();

  const createDefault = useCallback(
    () => props.schema && createDefaultValue(props.schema),
    [props.schema],
  );

  const { id: questionGroupId } = useParams();

  return (
    <>
      {!questionGroupId && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={addItem(path, createDefault())}
          >
            Add group
          </Button>
        </Box>
      )}

      {Array.from({ length: numberOfItems }).map((_, index) => {
        const childPath = Paths.compose(path, `${index}`);

        const deleteConfirm = (path: string) => {
          setHasError(false);
          const childData = Resolve.data(core?.data, path);
          if (!removeItems) {
            return;
          }

          if (!childData.id) {
            const p = path.substring(0, path.lastIndexOf('.'));
            removeItems(p, [index])();
          }

          deleteItem(childData.id)
            .unwrap()
            .then(
              (_successData) => {
                setHasError(false);
                const p = path.substring(0, path.lastIndexOf('.'));
                removeItems(p, [index])();
                setGroupDelete({ isOpen: false, path: '' });
                navigateToRoute('promptedQuestions');
              },
              (error) => {
                setHasError(true);
                setSubmissionError(error);
              },
            );
        };

        const handleQuestionDelete = (path: string) => {
          setHasError(false);
          const childData = Resolve.data(core?.data, path);

          if (!removeItems) {
            return;
          }

          if (!childData.id) {
            const questionDeleteIndex = path.split('.').pop();
            const formattedIndex = questionDeleteIndex
              ? parseInt(questionDeleteIndex, 10)
              : 0;
            const p = path.substring(0, path.lastIndexOf('.'));
            removeItems(p, [formattedIndex])();
            return setQuestionDelete({ isOpen: false, path: '' });
          }

          const splittedQuestionPath = path.split('.');
          const questionIndex = parseInt(
            splittedQuestionPath[splittedQuestionPath.length - 1],
            10,
          );

          deleteQuestionItem(childData.id)
            .unwrap()
            .then(
              (_successData) => {
                setHasError(false);
                const p = path.substring(0, path.lastIndexOf('.'));
                removeItems(p, [questionIndex])();
                setQuestionDelete({ isOpen: false, path: '' });
              },
              (error) => {
                setHasError(true);
                setSubmissionError(error);
              },
            );
        };

        return (
          <Box key={`question_group_${index}`}>
            {hasError && (
              <TransitionsModal
                title="There is a error with the server"
                description="Try again to submit the form"
                showButton
                errorList={submissionError?.data as { [key: string]: [string] }}
                open={open}
                handleClose={handleClose}
              />
            )}

            <QuestionGroup
              {...props}
              childPath={childPath}
              deleteConfirm={(path) => setGroupDelete({ isOpen: true, path })}
              handleQuestionDelete={(path) =>
                setQuestionDelete({ isOpen: true, path })
              }
            />

            <ConfirmDeleteDialog
              open={groupDelete.isOpen}
              onClose={handleGroupDeleteClose}
              onCancel={handleGroupDeleteClose}
              modalName="this group"
              handleDelete={() => deleteConfirm(groupDelete.path)}
            />

            <ConfirmDeleteDialog
              open={questionDelete.isOpen}
              onClose={handleQuestionDeleteClose}
              onCancel={handleQuestionDeleteClose}
              modalName="this question"
              handleDelete={() => handleQuestionDelete(questionDelete.path)}
            />
          </Box>
        );
      })}

      {!questionGroupId && numberOfItems > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={addItem(path, createDefault())}
          >
            Add group
          </Button>
        </Box>
      )}
    </>
  );
}

export const QuestionsGroupControlTester = rankWith(
  10,
  uiTypeIs('QuestionGroupControl'),
);

export const QuestionsGroupControlRenderer = withJsonFormsArrayLayoutProps(
  QuestionsGroupControl,
);
