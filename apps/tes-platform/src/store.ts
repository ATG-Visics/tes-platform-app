import { configureStore } from '@reduxjs/toolkit';
import { AccountsApi, accountsSlice } from '@tes/accounts';
import { ClientApi, ClientSlice } from '@tes/client';
import { SamplingPlanApi, SamplingPlanSlice } from '@tes/sampling-plan';
import { ProjectApi, ProjectSlice } from '@tes/project';
import { InstrumentApi, InstrumentSlice } from '@tes/instruments';
import { CalibrationApi, CalibrationSlice } from '@tes/calibration';
import { ProjectLocationApi } from '@tes/project-location';
import { SampleApi, sampleSlice, StaticApiDataApi } from '@tes/samples';
import { messageLogApi } from '@tes/message-log';
import { WeatherConditionsApi } from '@tes/weather-conditions';
import { SurveyMomentApi, surveySlice } from '@tes/survey';
import { SampleMediaApi, sampleMediaSlice } from '@tes/sample-media';
import { AuthenticationSlice } from '@tes/authentication';
import { QuestionApi, QuestionSlice } from '@tes/prompted-questions';
import { dashboardApi, platformSlice } from '@tes/platform';
import { OelSourceApi } from '@tes/jsonforms-extensions';
import { ActionLevelSourceApi } from '@tes/action-level-api';
import { UnitsApi } from '@tes/units-api';
import { AreaSubjectApi } from '@tes/area-subject-api';
import { PersonSubjectApi } from '@tes/person-subject-api';
import { StaticDropdownDataApi } from '@tes/static-dropdown-data';

export const createStore = () =>
  configureStore({
    reducer: {
      [AccountsApi.reducerPath]: AccountsApi.reducer,
      [ClientSlice.name]: ClientSlice.reducer,
      [ClientApi.reducerPath]: ClientApi.reducer,
      [SamplingPlanSlice.name]: SamplingPlanSlice.reducer,
      [SamplingPlanApi.reducerPath]: SamplingPlanApi.reducer,
      [ProjectSlice.name]: ProjectSlice.reducer,
      [ProjectApi.reducerPath]: ProjectApi.reducer,
      [ProjectLocationApi.reducerPath]: ProjectLocationApi.reducer,
      [InstrumentSlice.name]: InstrumentSlice.reducer,
      [InstrumentApi.reducerPath]: InstrumentApi.reducer,
      [CalibrationSlice.name]: CalibrationSlice.reducer,
      [CalibrationApi.reducerPath]: CalibrationApi.reducer,
      [AreaSubjectApi.reducerPath]: AreaSubjectApi.reducer,
      [PersonSubjectApi.reducerPath]: PersonSubjectApi.reducer,
      [sampleSlice.name]: sampleSlice.reducer,
      [SampleApi.reducerPath]: SampleApi.reducer,
      [messageLogApi.reducerPath]: messageLogApi.reducer,
      [WeatherConditionsApi.reducerPath]: WeatherConditionsApi.reducer,
      [StaticApiDataApi.reducerPath]: StaticApiDataApi.reducer,
      [SurveyMomentApi.reducerPath]: SurveyMomentApi.reducer,
      [surveySlice.name]: surveySlice.reducer,
      [SampleMediaApi.reducerPath]: SampleMediaApi.reducer,
      [sampleMediaSlice.name]: sampleMediaSlice.reducer,
      [AuthenticationSlice.name]: AuthenticationSlice.reducer,
      [accountsSlice.name]: accountsSlice.reducer,
      [QuestionApi.reducerPath]: QuestionApi.reducer,
      [QuestionSlice.name]: QuestionSlice.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
      [platformSlice.name]: platformSlice.reducer,
      [OelSourceApi.reducerPath]: OelSourceApi.reducer,
      [ActionLevelSourceApi.reducerPath]: ActionLevelSourceApi.reducer,
      [UnitsApi.reducerPath]: UnitsApi.reducer,
      [StaticDropdownDataApi.reducerPath]: StaticDropdownDataApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        AccountsApi.middleware,
        ClientApi.middleware,
        SamplingPlanApi.middleware,
        ProjectApi.middleware,
        InstrumentApi.middleware,
        ProjectLocationApi.middleware,
        CalibrationApi.middleware,
        SampleApi.middleware,
        messageLogApi.middleware,
        WeatherConditionsApi.middleware,
        StaticApiDataApi.middleware,
        SurveyMomentApi.middleware,
        SampleMediaApi.middleware,
        QuestionApi.middleware,
        dashboardApi.middleware,
        OelSourceApi.middleware,
        ActionLevelSourceApi.middleware,
        UnitsApi.middleware,
        AreaSubjectApi.middleware,
        PersonSubjectApi.middleware,
        StaticDropdownDataApi.middleware,
      ),
  });
