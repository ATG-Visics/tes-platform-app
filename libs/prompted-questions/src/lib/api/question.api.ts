import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthenticationState } from '@tes/authentication';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AccountsState } from '@tes/accounts';
import { OrderDirection } from '@tes/client';

interface IChoice {
  label: string;
  order: number;
}

export interface IQuestion {
  id: string;
  kind: 'text' | 'radio' | 'checkboxes' | 'select' | 'select_with_other';
  label: string;
  choices: Array<IChoice>;
}

export interface IGroup {
  id: string;
  title: string;
  repeatEverySurveyMoment: string;
  isRequiredForNewProjects: boolean;
  account: string;
  order: number;
  questions: Array<IQuestion>;
}

export interface IQuestionListItem {
  id: string;
  title: string;
  repeatEverySurveyMoment: string;
  isRequiredForNewProjects: boolean;
  questions: Array<IQuestion>;
}

export interface IAnswer {
  id: string;
  question: string;
  answer: string;
  answerOther: string | null;
  surveyMoment: null | string;
  project: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAnswerPayload {
  id?: string;
  question: string;
  answer: string;
  answerOther?: string | null;
  surveyMoment?: {
    project: string;
    startDate: string;
  };
  project?: null | string;
}

export interface IAnswerBulkPayload {
  [key: string]: IAnswerPayload | string | null;

  project: string;
}

export const QuestionApi = createApi({
  reducerPath: 'QuestionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as {
        authentication: AuthenticationState;
        accounts: AccountsState;
      };
      const accessToken = state['authentication'].accessToken;
      headers.set('Authorization', `Bearer ${accessToken}`);
      const accountToken = state['accounts'].accountId;
      headers.set('account', `${accountToken}`);
      return headers;
    },
  }),
  tagTypes: ['Questions', 'Answers'],
  endpoints: (builder) => ({
    getQuestionGroupByAccount: builder.query<
      DjangoRestFrameworkResult<IGroup>,
      Partial<{
        page: number;
        limit: number;
        orderBy: string;
        orderDirection: OrderDirection;
        search: string;
      }>
    >({
      query: (params) => {
        const {
          page = 0,
          limit = 1000,
          orderBy = '',
          orderDirection = OrderDirection.ASC,
          search,
        } = params || {};

        let ordering = '';
        if (orderBy !== '') {
          ordering = orderBy;

          if (orderDirection === OrderDirection.DESC) {
            ordering = `-${ordering}`;
          }
        }

        return {
          url: `/prompted-questions-groups/`,
          params: {
            search,
            limit: limit,
            ordering,
            offset: page * limit,
          },
        };
      },
      providesTags: [{ type: 'Questions', id: 'LIST' }],
    }),
    getQuestionGroupByProject: builder.query<
      DjangoRestFrameworkResult<IGroup>,
      string
    >({
      query: (projectId) => `prompted-questions-groups/?project=${projectId}`,
      providesTags: [{ type: 'Questions', id: 'LIST' }],
    }),
    getQuestionGroupById: builder.query<IGroup, string>({
      query: (uuid) => `/prompted-questions-groups/${uuid}/`,
      providesTags: [{ type: 'Questions', id: 'DETAIL' }],
    }),
    updateGroupById: builder.mutation<
      IGroup[],
      { uuid: string; body: Partial<{ group: Array<IGroup> }> }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `/prompted-questions-groups/${uuid}/`,
          method: 'PUT',
          body: body.group && body.group[0],
        };
      },
      transformResponse: (response: IGroup, _meta, _args) => {
        return [response];
      },
      invalidatesTags: () => [
        { type: 'Questions', id: 'LIST' },
        { type: 'Questions', id: 'DETAIL' },
      ],
    }),
    createGroupItem: builder.mutation<IGroup, { body: Partial<IGroup> }>({
      query: ({ body }) => {
        return {
          url: `/prompted-questions-groups/`,
          method: 'POST',
          body,
        };
      },
    }),
    updateGroupItem: builder.mutation<
      IGroup,
      { uuid: string; body: Partial<IGroup> }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `/prompted-questions-groups/${uuid}/`,
          method: 'PUT',
          body,
        };
      },
    }),
    updateOrCreateGroupItems: builder.mutation<
      IGroup[],
      Partial<{ group: Array<IGroup> }>
    >({
      queryFn: async ({ group }, queryApi) => {
        const { dispatch } = queryApi;
        const { updateGroupItem, createGroupItem } = QuestionApi.endpoints;
        let result: IGroup[] = [];

        if (!group) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Unable to update one or more items',
              data: '',
            },
          };
        }

        try {
          result = await Promise.all(
            group.map((item: IGroup) => {
              if (item.id) {
                return dispatch(
                  updateGroupItem.initiate({
                    uuid: item.id,
                    body: item,
                  }),
                ).unwrap();
              } else {
                return dispatch(
                  createGroupItem.initiate({
                    body: item,
                  }),
                ).unwrap();
              }
            }),
          );
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Unable to update one or more items',
              data: (error as { data: string }).data,
            },
          };
        }

        return {
          data: result,
        };
      },
      invalidatesTags: [
        { type: 'Questions', id: 'LIST' },
        { type: 'Questions', id: 'COUNT' },
      ],
    }),
    deleteQuestionGroup: builder.mutation<IGroup, string>({
      query: (uuid) => {
        return {
          url: `/prompted-questions-groups/${uuid}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [
        { type: 'Questions', id: 'LIST' },
        { type: 'Questions', id: 'COUNT' },
      ],
    }),
    deleteQuestion: builder.mutation<IGroup, string>({
      query: (uuid) => {
        return {
          url: `/prompted-questions-questions/${uuid}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [
        { type: 'Questions', id: 'LIST' },
        { type: 'Questions', id: 'COUNT' },
      ],
    }),
    getAllAnswerPerProject: builder.query<
      DjangoRestFrameworkResult<IAnswer>,
      string
    >({
      query: (projectId) => {
        return {
          url: `prompted-questions-answers/`,
          params: {
            project: projectId,
          },
        };
      },
      providesTags: [
        { type: 'Answers', id: 'LIST' },
        { type: 'Questions', id: 'LIST' },
      ],
    }),
    getAllAnswerPerProjectAndSurveyMoment: builder.query<
      DjangoRestFrameworkResult<IAnswer>,
      {
        projectId: string;
        selectedDate: string;
      }
    >({
      query: ({ projectId, selectedDate }) => {
        return {
          url: `prompted-questions-answers/`,
          params: {
            project: projectId,
            survey_moment__start_date: selectedDate,
            survey_moment__project: projectId,
          },
        };
      },
      providesTags: [
        { type: 'Answers', id: 'LIST' },
        { type: 'Questions', id: 'LIST' },
      ],
    }),
    createAnswerQuestion: builder.mutation<
      IAnswer,
      { body: Partial<IAnswerPayload> }
    >({
      query: ({ body }) => {
        return {
          url: `prompted-questions-answers/`,
          method: 'POST',
          body,
        };
      },
    }),
    updateAnswerQuestion: builder.mutation<
      IAnswer,
      { uuid: string; body: Partial<IAnswerPayload> }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `prompted-questions-answers/${uuid}/`,
          method: 'PUT',
          body,
        };
      },
    }),
    updateOrCreateAnswerItems: builder.mutation<
      IAnswer[],
      Partial<IAnswerBulkPayload>
    >({
      queryFn: async (itemList, queryApi) => {
        const { dispatch } = queryApi;
        const { updateAnswerQuestion, createAnswerQuestion } =
          QuestionApi.endpoints;
        let result: IAnswer[] = [];

        if (!itemList) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Unable to update one or more items',
            },
          };
        }

        const newItemList: Array<Partial<IAnswerPayload>> = [];

        for (const [key, value] of Object.entries(itemList)) {
          let item: Partial<IAnswerPayload> = {};

          if (typeof value === 'object') {
            item = {
              project: itemList['project'] as string,
              question: key,
              ...value,
            };
          }
          newItemList.push(item);
        }

        try {
          result = await Promise.all(
            newItemList.map((item: Partial<IAnswerPayload>) => {
              if (Object.keys(item).length === 0) {
                return {} as IAnswer;
              }

              if (item.id) {
                return dispatch(
                  updateAnswerQuestion.initiate({
                    uuid: item.id,
                    body: item,
                  }),
                ).unwrap();
              } else {
                return dispatch(
                  createAnswerQuestion.initiate({
                    body: item,
                  }),
                ).unwrap();
              }
            }),
          );
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Unable to update one or more items',
            },
          };
        }

        return {
          data: result,
        };
      },

      invalidatesTags: [
        { type: 'Questions', id: 'LIST' },
        { type: 'Questions', id: 'COUNT' },
        { type: 'Answers', id: 'LIST' },
      ],
    }),
    getAnswerCount: builder.query<
      { count: number },
      { project: string; startDate: string }
    >({
      query: ({ project, startDate }) => {
        return {
          url: `prompted-questions-questions/unanswered-count/${project}`,
          params: {
            date: startDate,
          },
        };
      },
      providesTags: [{ type: 'Questions', id: 'COUNT' }],
    }),
    getGroupAnswerCheck: builder.query<
      { count: number },
      { uuid: string; project?: string }
    >({
      query: ({ project, uuid }) => {
        return {
          url: `prompted-questions-groups/${uuid}/answer-count/${project}`,
        };
      },
    }),
    setGroupAnswerHidden: builder.mutation<
      { count: number },
      { uuid: string; project?: string }
    >({
      query: ({ project, uuid }) => {
        return {
          url: `prompted-questions-answers/set-is-hidden/`,
          method: 'POST',
          body: {
            project: project,
            group: uuid,
          },
        };
      },
    }),
    removeIsHiddenFlag: builder.mutation<
      { count: number },
      { uuid: string; project?: string }
    >({
      query: ({ project, uuid }) => {
        return {
          url: `prompted-questions-answers/remove-is-hidden/`,
          method: 'POST',
          body: {
            project: project,
            group: uuid,
          },
        };
      },
    }),
    getProjectByIdAnswers: builder.query<{ title: string }, string>({
      query: (uuid) => `/projects/${uuid}/`,
    }),
    downloadAllAnswersStarter: builder.mutation<
      { taskId: string; status: string },
      { project: string; startDate?: string }
    >({
      query: ({ project, startDate }) => {
        const params: Record<string, string> = {};
        if (startDate) {
          params['surveyDate'] = startDate;
        }
        return {
          url: `projects/${project}/export_question_answers/`,
          method: 'GET',
          params,
        };
      },
    }),
    downloadAllAnswersStatus: builder.query<
      unknown,
      { taskId: string; uuid: string; fileName: string }
    >({
      queryFn: async (
        { taskId, uuid, fileName },
        _api,
        _extraOptions,
        baseQuery,
      ) => {
        const response = await baseQuery({
          url: `projects/${uuid}/export_question_answers_status/`,
          params: {
            task_id: taskId,
          },
        });

        const result = response as unknown as {
          data: { status: string; downloadUrl: string };
        };

        if (result.data.status === 'completed') {
          const fileUrl = new URL(
            result?.data.downloadUrl || '',
          ).pathname.substring(8);
          const fileResponse = await baseQuery({
            url: `${fileUrl}`,
            responseHandler: (response) => response.blob(),
          });
          const hiddenElement = document.createElement('a');
          const url = window.URL || window.webkitURL;
          const blobPDF = new Blob([fileResponse.data as unknown as BlobPart], {
            type: 'application/pdf',
          });

          const blobPDFUrl = url.createObjectURL(blobPDF);
          hiddenElement.href = blobPDFUrl;
          hiddenElement.target = '_blank';
          hiddenElement.download = `${fileName}`;
          hiddenElement.click();
          window.URL.revokeObjectURL(blobPDFUrl);
        }

        return response;
      },
    }),
  }),
});

export const {
  useGetAllAnswerPerProjectQuery,
  useGetAllAnswerPerProjectAndSurveyMomentQuery,
  useGetQuestionGroupByIdQuery,
  useGetQuestionGroupByProjectQuery,
  useGetAnswerCountQuery,
  useUpdateOrCreateGroupItemsMutation,
  useGetQuestionGroupByAccountQuery,
  useDeleteQuestionGroupMutation,
  useDeleteQuestionMutation,
  useUpdateOrCreateAnswerItemsMutation,
  useUpdateGroupByIdMutation,
  useGetGroupAnswerCheckQuery,
  useSetGroupAnswerHiddenMutation,
  useRemoveIsHiddenFlagMutation,
  useGetProjectByIdAnswersQuery,
  useDownloadAllAnswersStarterMutation,
  useDownloadAllAnswersStatusQuery,
} = QuestionApi;
