import { ICustomRoute } from './routes';

export const clientRoutes: ICustomRoute[] = [
  {
    path: '/client/create/',
    name: 'clientCreate',
    meta: {
      title: 'Create Client',
      roles: ['owner'],
    },
  },
  {
    path: '/client/:id/',
    name: 'clientDetail',
    meta: {
      title: 'Client Detail',
      roles: ['owner'],
    },
  },
  {
    path: '/client/:id/update/',
    name: 'clientUpdate',
    meta: {
      title: 'Update Client',
      roles: ['owner'],
    },
  },
];
