import { ICustomRoute } from './routes';

export const projectDashboardMenuRoutes: ICustomRoute[] = [
  {
    path: 'project-dashboard',
    name: 'projectDashboardHome',
    meta: {
      title: 'Project Dashboard',
      roles: ['owner', 'client'],
    },
  },
  {
    path: 'survey-dashboard',
    name: 'surveyDashboard',
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

const projectDashboardRoutes: ICustomRoute[] = [
  {
    path: 'sampling-plans/',
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
    path: 'sampling-plans/create/',
    name: 'samplingPlanCreate',
    meta: {
      title: 'Create Sampling Plan',
      roles: ['owner'],
    },
  },
  {
    path: 'sampling-plans/:samplingPlanId/',
    name: 'samplingPlanUpdate',
    meta: {
      title: 'Edit Sampling Plan',
      roles: ['owner'],
    },
  },
];

export const surveyDashboardRoutes: ICustomRoute[] = [
  //weather
  {
    path: 'weather/create',
    name: 'weatherCreate',
    meta: {
      title: 'Create Weather',
      roles: ['owner'],
    },
  },
  {
    path: 'weather/:weatherId',
    name: 'weatherUpdate',
    meta: {
      title: 'Update Weather',
      roles: ['owner'],
    },
  },
  // subjects
  {
    path: 'area/create',
    name: 'subjectAreaCreate',
    meta: {
      title: 'Create Area Subject',
      roles: ['owner'],
    },
  },
  {
    path: 'area/:subjectId',
    name: 'subjectAreaDetail',
    meta: {
      title: 'Subject Area Detail',
      roles: ['owner', 'client'],
    },
  },
  {
    path: 'area/:subjectId/update',
    name: 'subjectAreaUpdate',
    meta: {
      title: 'Subject Area Detail',
      roles: ['owner'],
    },
  },
  {
    path: 'person/create',
    name: 'subjectPersonCreate',
    meta: {
      title: 'Create Person Subject',
      roles: ['owner'],
    },
  },
  {
    path: 'person/:subjectId',
    name: 'subjectPersonDetail',
    meta: {
      title: 'Subject Person Detail',
      roles: ['owner', 'client'],
    },
  },
  {
    path: 'person/:subjectId/update',
    name: 'subjectPersonUpdate',
    meta: {
      title: 'Subject Person Detail',
      roles: ['owner'],
    },
  },
  //samples
  {
    path: ':subjectType/:subjectId/sample/:sampleId',
    name: 'sampleDetail',
    meta: {
      title: 'Sample Detail',
      roles: ['owner', 'client'],
    },
  },
  {
    path: ':subjectType/:subjectId/sample/create',
    name: 'sampleCreate',
    meta: {
      title: 'Create Sample',
      roles: ['owner'],
    },
  },
  {
    path: ':subjectType/:subjectId/sample/:sampleId/update',
    name: 'sampleUpdate',
    meta: {
      title: 'Update Sample',
      roles: ['owner'],
    },
  },
  {
    path: ':subjectType/:subjectId/sample/:sampleId/finish',
    name: 'sampleFinish',
    meta: {
      title: 'Finish Sample',
      roles: ['owner'],
    },
  },
  {
    path: ':subjectType/:subjectId/sample/:sampleId/move',
    name: 'moveSample',
    meta: {
      title: 'Move Sample',
      roles: ['owner'],
    },
  },
  {
    path: ':subjectType/:subjectId/sample/:sampleId/chem-result/:hazardId',
    name: 'chemSampleResultCreate',
    meta: {
      title: 'Chem Sample Result',
      roles: ['owner'],
    },
  },
  {
    path: ':subjectType/:subjectId/sample/:sampleId/noise-result',
    name: 'noiseResultCreate',
    meta: {
      title: 'Noise Result',
      roles: ['owner'],
    },
  },
];

type ProjectDashboardSubRoutes = {
  [key: string]: ICustomRoute[];
};

export const allProjectDashboardRoutes: ICustomRoute[] = [
  ...projectDashboardMenuRoutes,
  ...projectDashboardRoutes,
  ...surveyDashboardRoutes,
];

export const projectDashboardSubRoutes: ProjectDashboardSubRoutes = {
  projectDashboardHome: projectDashboardRoutes,
  surveyDashboard: surveyDashboardRoutes,
  projectInfo: [],
  locationInfo: [],
  questions: [],
};
