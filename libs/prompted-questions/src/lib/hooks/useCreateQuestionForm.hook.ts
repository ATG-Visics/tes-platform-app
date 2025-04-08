import { IQuestion, useGetQuestionGroupByProjectQuery } from '../api';
import { mapListResult } from '@tes/utils-hooks';
import { useMemo, useState } from 'react';

function createSchema(question: IQuestion) {
  switch (question.kind) {
    case 'text': {
      return {
        [question.id]: {
          type: 'object',
          properties: {
            id: {
              type: ['string', 'null'],
            },
            project: {
              type: 'string',
            },
            question: {
              type: 'string',
              default: `${question.id}`,
            },
            answer: {
              type: 'string',
            },
            answerOther: {
              type: ['string', 'null'],
            },
          },
        },
      };
    }
    case 'radio': {
      const options = question.choices.map((item) => item.label);

      const formattedOptions =
        options.length > 0 ? options : ['No answers filled in'];
      return {
        [question.id]: {
          type: 'object',
          properties: {
            id: {
              type: ['string', 'null'],
            },
            project: {
              type: 'string',
            },
            question: {
              type: 'string',
              default: `${question.id}`,
            },
            answer: {
              type: 'string',
              enum: formattedOptions,
            },
            answerOther: {
              type: ['string', 'null'],
            },
          },
        },
      };
    }
    case 'checkboxes': {
      const options = question.choices.map((item) => ({
        const: item.label.replaceAll(' ', '_').toLowerCase(),
        title: item.label,
      }));
      const formattedOptions =
        options.length > 0
          ? options
          : [{ const: 'no_answers_filled_in', title: 'No answers filled in' }];
      return {
        [question.id]: {
          type: 'object',
          properties: {
            id: {
              type: ['string', 'null'],
            },
            project: {
              type: 'string',
            },
            question: {
              type: 'string',
              default: `${question.id}`,
            },
            answer: {
              type: 'array',
              items: {
                oneOf: formattedOptions,
              },
            },
            answerOther: {
              type: ['string', 'null'],
            },
          },
        },
      };
    }
    case 'select': {
      const options = question.choices.map((item) => ({
        const: item.label.replaceAll(' ', '_').toLowerCase(),
        title: item.label,
      }));
      const formattedOptions =
        options.length > 0
          ? options
          : [{ const: 'no_answers_filled_in', title: 'No answers filled in' }];
      return {
        [question.id]: {
          type: 'object',
          properties: {
            id: {
              type: ['string', 'null'],
            },
            project: {
              type: 'string',
            },
            question: {
              type: 'string',
              default: `${question.id}`,
            },
            answer: {
              type: 'string',
              oneOf: formattedOptions,
            },
            answerOther: {
              type: ['string', 'null'],
            },
          },
        },
      };
    }
    case 'select_with_other': {
      const options = question.choices.map((item) => {
        if (['Other', 'other'].includes(item.label)) {
          return { const: 'other', title: 'Other' };
        }

        return {
          const: item.label.replaceAll(' ', '_').toLowerCase(),
          title: item.label,
        };
      });

      const hasOther = options.find((item) => item.const === 'other');

      let prevOptions = options;

      if (!hasOther) {
        prevOptions = [...options, { const: 'other', title: 'Other' }];
      }

      const formattedOptions =
        options.length > 0
          ? [...prevOptions]
          : [{ const: 'no_answers_filled_in', title: 'No answers filled in' }];
      return {
        [question.id]: {
          type: 'object',
          properties: {
            id: {
              type: ['string', 'null'],
            },
            project: {
              type: 'string',
            },
            question: {
              type: 'string',
              default: `${question.id}`,
            },
            answer: {
              type: 'string',
              oneOf: formattedOptions,
            },
            answerOther: {
              type: ['string', 'null'],
            },
          },
        },
      };
    }
    default: {
      return {
        [question.id]: {
          type: 'object',
          properties: {
            id: {
              type: ['string', 'null'],
            },
            project: {
              type: 'string',
            },
            question: {
              type: 'string',
              default: `${question.id}`,
            },
            answer: {
              type: 'string',
            },
            answerOther: {
              type: ['string', 'null'],
            },
          },
        },
      };
    }
  }
}

function createUISchema(question: IQuestion) {
  switch (question.kind) {
    case 'text': {
      return {
        type: 'TextControlWithMention',
        label: question.label,
        scope: `#/properties/${question.id}/properties/answer`,
        options: {
          isQuestion: true,
        },
      };
    }
    case 'radio': {
      return {
        type: 'Control',
        label: question.label,
        scope: `#/properties/${question.id}/properties/answer`,
        options: {
          format: 'radio',
          isQuestion: true,
        },
      };
    }
    case 'checkboxes': {
      return {
        type: 'CheckBoxControl',
        label: question.label,
        scope: `#/properties/${question.id}/properties/answer`,
        options: {
          isQuestion: true,
        },
      };
    }
    case 'select': {
      return {
        type: 'Control',
        label: question.label,
        scope: `#/properties/${question.id}/properties/answer`,
        options: {
          isQuestion: true,
        },
      };
    }
    case 'select_with_other': {
      return {
        type: 'ControlWithOtherAndMention',
        label: question.label,
        scope: `#/properties/${question.id}/properties/answer`,
        options: {
          otherApiName: 'answerOther',
          isQuestion: true,
        },
      };
    }
    default: {
      return {
        type: 'Control',
        label: question.label,
        scope: `#/properties/${question.id}/properties/answer`,
        options: {
          isQuestion: true,
        },
      };
    }
  }
}

export enum QUESTION_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

interface IProps {
  projectId: string;
}

export interface GroupItem {
  title: string;
  repeatEverySurveyMoment: string;
  questionSchema: { type: string; properties: object };
  questionUISchema: {
    type: string;
    elements: (
      | {
          type: string;
          label: string;
          scope: string;
          options?: undefined;
        }
      | object
    )[];
  };
}

export function useCreateQuestionFormHook(props: IProps) {
  const { projectId } = props;
  const { data: groupData, isLoading: questionIsLoading } =
    useGetQuestionGroupByProjectQuery(projectId, {
      skip: !projectId,
    });
  const [status, setStatus] = useState<QUESTION_STATUS>(QUESTION_STATUS.IDLE);
  const { itemList } = mapListResult(groupData);

  const groupList: Array<GroupItem> = useMemo(() => {
    if (questionIsLoading) {
      return [];
    }

    if (status === QUESTION_STATUS.LOADING) {
      return [];
    }

    setStatus(QUESTION_STATUS.LOADING);
    return itemList.map((group) => {
      const schemaSetup = group.questions.map((question) =>
        createSchema(question),
      );

      const schema = schemaSetup.reduceRight(
        (accumulator, currentValue) => ({
          ...accumulator,
          properties: { ...accumulator['properties'], ...currentValue },
        }),
        {
          type: 'object',
          properties: {},
        },
      );

      const uiSchema = {
        type: 'VerticalLayout',
        elements: group.questions.map((question) => createUISchema(question)),
      };

      setStatus(QUESTION_STATUS.SUCCEEDED);
      return {
        title: group.title,
        repeatEverySurveyMoment: group.repeatEverySurveyMoment,
        questionSchema: schema,
        questionUISchema: uiSchema,
      };
    });
  }, [itemList, questionIsLoading, status]);

  const staticGroupList = groupList.filter(
    (item) => !item.repeatEverySurveyMoment,
  );
  const dynamicGroupList = groupList.filter(
    (item) => item.repeatEverySurveyMoment,
  );

  return { groupList, status, staticGroupList, dynamicGroupList };
}
