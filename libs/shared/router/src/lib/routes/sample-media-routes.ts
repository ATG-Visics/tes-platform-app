import { ICustomRoute } from './routes';

export const sampleMediaRoutes: ICustomRoute[] = [
  {
    path: '/sample-media/create/',
    name: 'sampleMediaCreate',
    meta: {
      title: 'Create Sample Media',
      roles: ['owner'],
    },
  },
  {
    path: '/sample-media/:id/update/',
    name: 'sampleMediaUpdate',
    meta: {
      title: 'Update Sample Media',
      roles: ['owner'],
    },
  },
];
