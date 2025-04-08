import { ICustomRoute } from './routes';

export const projectRoutes: ICustomRoute[] = [
  {
    path: '/project/create',
    name: 'projectCreate',
    meta: {
      title: 'Create Project',
      roles: ['owner'],
    },
  },
  {
    path: '/project/create/:clientId',
    name: 'projectCreateWithClientId',
    meta: {
      title: 'Create Project',
      roles: ['owner'],
    },
  },
  {
    path: '/project/:id',
    name: 'projectDetail',
    meta: {
      title: 'Project Detail',
      roles: ['owner'],
    },
  },
  {
    path: '/project/:id/update',
    name: 'projectUpdate',
    meta: {
      title: 'Update Project',
      roles: ['owner'],
    },
  },
  {
    path: '/project-locations/:id/update',
    name: 'projectLocationUpdate',
    meta: {
      title: 'Update Project Location',
      roles: ['owner'],
    },
  },
];
