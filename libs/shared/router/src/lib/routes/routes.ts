import { RouteProps } from 'react-router-dom';
import { clientRoutes } from './client-routes';
import { promptedQuestionsRoutes } from './questions-routes';
import { instrumentRoutes } from './instrument-routes';
import { calibrationRoutes } from './calibration-routes';
import { sampleMediaRoutes } from './sample-media-routes';
import { surveyDashboardRoutes } from './project-dashboard-routes';
import { projectRoutes } from './project-routes';

type role = 'owner' | 'client';

export interface ICustomRoute extends RouteProps {
  name: string;
  path: string;
  children?: ICustomRoute[];
  meta: {
    layout?: string;
    title: string;
    menuItem?: boolean;
    icon?: string;
    plans?: string[];
    roles?: role[];
  };
}

export const publicRoutes: ICustomRoute[] = [
  {
    path: '/account-select',
    name: 'accountSelect',
    meta: {
      title: 'Account Select',
      roles: ['owner', 'client'],
    },
  },
];

export const mainRoutes: ICustomRoute[] = [
  {
    path: 'dashboard',
    name: 'dashboard',
    meta: {
      title: 'Dashboard',
      roles: ['owner', 'client'],
      menuItem: true,
      icon: 'dashboard',
    },
  },
  {
    path: 'client',
    name: 'clientList',
    meta: {
      title: 'Client',
      menuItem: true,
      roles: ['owner'],
      icon: 'person',
    },
  },
  ...clientRoutes,
  {
    path: 'project',
    name: 'projectList',
    meta: {
      title: 'Projects',
      menuItem: true,
      roles: ['owner', 'client'],
      icon: 'work',
    },
  },
  ...projectRoutes,
  {
    path: 'samples',
    name: 'sampleList',
    meta: {
      title: 'Samples',
      menuItem: true,
      roles: ['owner', 'client'],
      icon: 'science',
    },
  },
  {
    path: 'sample-media',
    name: 'sampleMediaList',
    meta: {
      title: 'Sample Media',
      menuItem: true,
      roles: ['owner'],
      icon: 'mediation',
    },
  },
  ...sampleMediaRoutes,
  {
    path: 'instruments',
    name: 'instrumentList',
    meta: {
      title: 'Instruments',
      menuItem: true,
      roles: ['owner'],
      icon: 'construction',
    },
  },
  ...instrumentRoutes,
  {
    path: 'calibration',
    name: 'calibrationList',
    meta: {
      title: 'Calibration',
      menuItem: true,
      roles: ['owner'],
      icon: 'speakerGroup',
    },
  },
  ...calibrationRoutes,
  {
    path: 'prompted-questions',
    name: 'promptedQuestions',
    meta: {
      title: 'Question groups',
      menuItem: true,
      roles: ['owner'],
      icon: 'dynamicForm',
    },
  },
  ...promptedQuestionsRoutes,
];

const projectOverviewRoutes: ICustomRoute[] = [
  {
    path: 'sampling-plans',
    name: 'samplingPlanList',
    meta: {
      title: 'Sampling Plans',
      roles: ['owner'],
    },
  },
  {
    path: 'sampling-plans/import-export/',
    name: 'samplingPlanImportExport',
    meta: {
      title: 'Sampling Plans Import/Export',
      roles: ['owner'],
    },
  },
  {
    path: 'sampling-plans/create',
    name: 'samplingPlanCreate',
    meta: {
      title: 'Create Sampling Plan',
      roles: ['owner'],
    },
  },
  {
    path: 'sampling-plans/:samplingPlanId',
    name: 'samplingPlanUpdate',
    meta: {
      title: 'Edit Sampling Plan',
      roles: ['owner'],
    },
  },
];

const projectDashboardMenuRoutes: ICustomRoute[] = [
  {
    path: 'project-overview',
    name: 'projectOverview',
    children: [...projectOverviewRoutes],
    meta: {
      title: 'Project Dashboard',
      roles: ['owner', 'client'],
    },
  },
  {
    path: 'survey-dashboard',
    name: 'surveyDashboard',
    children: [...surveyDashboardRoutes],
    meta: {
      title: 'Survey Dashboard',
      roles: ['owner', 'client'],
    },
  },
  {
    path: 'project-info',
    name: 'projectInfo',
    meta: {
      title: 'Project Info',
      roles: ['owner', 'client'],
    },
  },
  {
    path: 'location-info',
    name: 'locationInfo',
    meta: {
      menuItem: true,
      title: 'Location Info',
      roles: ['owner', 'client'],
    },
  },
  {
    path: 'questions',
    name: 'questions',
    meta: {
      title: 'Questions',
      roles: ['owner', 'client'],
    },
  },
];

export const routes: ICustomRoute[] = [
  ...publicRoutes,
  {
    path: '/',
    name: 'platformBaseLayout',
    children: [...mainRoutes],
    meta: {
      title: 'Home',
      roles: ['owner', 'client'],
    },
  },
  {
    path: '/project-dashboard/:id',
    name: 'projectDashboardLayout',
    children: [...projectDashboardMenuRoutes],
    meta: {
      title: 'Project Dashboard',
      roles: ['owner', 'client'],
    },
  },
];
