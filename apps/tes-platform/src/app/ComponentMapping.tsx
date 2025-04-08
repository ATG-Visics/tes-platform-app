import {
  ComponentType as ReactComponentType,
  lazy,
  LazyExoticComponent,
} from 'react';

import { DashboardPage, PlatformBaseLayout } from '@tes/platform';
import {
  AnswerCreatePage,
  QuestionCreatePage,
  QuestionGroupListPage,
} from '@tes/prompted-questions';
import {
  ProjectCreatePage,
  ProjectDetailPage,
  ProjectInfoPage,
  ProjectListPage,
  ProjectLocationPage,
} from '@tes/project';
import {
  ChemSampleResultCreatePage,
  MoveSamplePage,
  NoiseCreateResultPage,
  SampleCreatePage,
  SampleDetailPage,
  SampleFinishPage,
  SampleListPage,
} from '@tes/samples';
import { SampleMediaCreatePage, SampleMediaListPage } from '@tes/sample-media';
import {
  InstrumentCreatePage,
  InstrumentDetailPage,
  InstrumentListPage,
} from '@tes/instruments';
import {
  CalibrationCreatePage,
  CalibrationDetailPage,
  CalibrationListPage,
} from '@tes/calibration';
import { ClientCreatePage } from '@tes/client';
import { ProjectLocationUpdatePage } from '@tes/project-location';
import { SelectAccountView } from '@tes/accounts';
import {
  ProjectDashboard,
  ProjectDashboardLayout,
  SurveyDashboard,
} from '@tes/project-dashboard';
import {
  SamplingPlanCreatePage,
  SamplingPlanImportExportModal,
  SamplingPlanListModal,
} from '@tes/sampling-plan';
import {
  AreaSampleSubjectCreatePage,
  AreaSampleSubjectDetailPage,
  AreaSampleSubjectUpdatePage,
} from '@tes/area-sample-subject';
import {
  PersonSubjectCreatePage,
  PersonSubjectDetailPage,
  PersonSubjectUpdatePage,
} from '@tes/person-subject';
import { WeatherConditionCreatePage } from '@tes/weather-conditions';

// Lazy modules
// TODO: check which routes need to be lazy
const ClientListPage = lazy(() =>
  import('@tes/client').then((module) => ({ default: module.ClientListPage })),
);
const ClientDetailPage = lazy(() =>
  import('@tes/client').then((module) => ({
    default: module.ClientDetailPage,
  })),
);

type ComponentProps = {
  [key: string]: Record<string, unknown>;
};

type ComponentType<T = ComponentProps> =
  | ReactComponentType<T>
  | LazyExoticComponent<ReactComponentType<T>>;

export const componentMapping: Record<string, ComponentType> = {
  home: PlatformBaseLayout,
  platformBaseLayout: PlatformBaseLayout,
  accountSelect: SelectAccountView,
  // Menu routes
  dashboard: DashboardPage,
  clientList: ClientListPage,
  clientDetail: ClientDetailPage,
  clientUpdate: ClientCreatePage,
  clientCreate: ClientCreatePage,
  promptedQuestions: QuestionGroupListPage,
  promptedQuestionsCreate: QuestionCreatePage,
  promptedQuestionsDetail: QuestionCreatePage,
  projectList: ProjectListPage,
  projectUpdate: ProjectCreatePage,
  projectCreate: ProjectCreatePage,
  projectCreateWithClientId: ProjectCreatePage,
  projectDetail: ProjectDetailPage,
  projectLocationUpdate: ProjectLocationUpdatePage,
  sampleList: SampleListPage,
  sampleMediaList: SampleMediaListPage,
  sampleMediaCreate: SampleMediaCreatePage,
  sampleMediaUpdate: SampleMediaCreatePage,
  instrumentList: InstrumentListPage,
  instrumentUpdate: InstrumentCreatePage,
  instrumentCreate: InstrumentCreatePage,
  instrumentDetail: InstrumentDetailPage,
  calibrationList: CalibrationListPage,
  calibrationUpdate: CalibrationCreatePage,
  calibrationCreate: CalibrationCreatePage,
  calibrationDetail: CalibrationDetailPage,
  // Project Dashboard Routes
  projectDashboardLayout: ProjectDashboardLayout,
  projectOverview: ProjectDashboard,
  surveyDashboard: SurveyDashboard,
  projectInfo: ProjectInfoPage,
  locationInfo: ProjectLocationPage,
  questions: AnswerCreatePage,
  // Project Dashboard Sub Routes
  samplingPlanList: SamplingPlanListModal,
  samplingPlanImportExport: SamplingPlanImportExportModal,
  samplingPlanCreate: SamplingPlanCreatePage,
  samplingPlanUpdate: SamplingPlanCreatePage,
  // Survey Dashboard
  // weather
  weatherCreate: WeatherConditionCreatePage,
  weatherUpdate: WeatherConditionCreatePage,
  // subject
  subjectAreaCreate: AreaSampleSubjectCreatePage,
  subjectAreaDetail: AreaSampleSubjectDetailPage,
  subjectAreaUpdate: AreaSampleSubjectUpdatePage,
  subjectPersonCreate: PersonSubjectCreatePage,
  subjectPersonDetail: PersonSubjectDetailPage,
  subjectPersonUpdate: PersonSubjectUpdatePage,
  //samples
  sampleDetail: SampleDetailPage,
  sampleCreate: SampleCreatePage,
  sampleUpdate: SampleCreatePage,
  sampleFinish: SampleFinishPage,
  moveSample: MoveSamplePage,
  chemSampleResultCreate: ChemSampleResultCreatePage,
  noiseResultCreate: NoiseCreateResultPage,
};
