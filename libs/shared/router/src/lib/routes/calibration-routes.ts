import { ICustomRoute } from './routes';

export const calibrationRoutes: ICustomRoute[] = [
  {
    path: '/calibration/create',
    name: 'calibrationCreate',
    meta: {
      title: 'Create Calibration Device',
      roles: ['owner'],
    },
  },
  {
    path: '/calibration/:id',
    name: 'calibrationDetail',
    meta: {
      title: 'Calibration Device Detail',
      roles: ['owner'],
    },
  },
  {
    path: '/calibration/:id/update',
    name: 'calibrationUpdate',
    meta: {
      title: 'Update Calibration Device',
      roles: ['owner'],
    },
  },
];
