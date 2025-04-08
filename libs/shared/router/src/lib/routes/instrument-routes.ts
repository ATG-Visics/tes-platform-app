import { ICustomRoute } from './routes';

export const instrumentRoutes: ICustomRoute[] = [
  {
    path: '/instruments/create',
    name: 'instrumentCreate',
    meta: {
      title: 'Create Instrument',
      roles: ['owner'],
    },
  },
  {
    path: '/instruments/:id',
    name: 'instrumentDetail',
    meta: {
      title: 'Instrument Detail',
      roles: ['owner'],
    },
  },
  {
    path: '/instruments/:id/update',
    name: 'instrumentUpdate',
    meta: {
      title: 'Update Instrument',
      roles: ['owner'],
    },
  },
];
