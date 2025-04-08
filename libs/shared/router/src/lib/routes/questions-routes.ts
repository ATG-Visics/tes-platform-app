import { ICustomRoute } from './routes';

export const promptedQuestionsRoutes: ICustomRoute[] = [
  {
    path: '/prompted-questions/create/',
    name: 'promptedQuestionsCreate',
    meta: {
      title: 'Create Questions',
      roles: ['owner'],
    },
  },
  {
    path: '/prompted-questions/:id/',
    name: 'promptedQuestionsDetail',
    meta: {
      title: 'Questions Detail',
      roles: ['owner'],
    },
  },
];
