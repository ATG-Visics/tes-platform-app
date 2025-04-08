import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { AuthenticationState } from '@tes/authentication';

export interface IWeatherCondition {
  id: string;
  surveyMoment: {
    startDate: string;
    project: string;
  };
  title: string;
  measuredAt: string;
  temperatureFahrenheit: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: string;
  windDirectionDisplay: string;
  pressure: string;
  precipitations: Array<string>;
  startOfDayPresent: boolean;
  endOfDayPresent: boolean;
}

export interface IWeatherConditionPayload {
  surveyMoment: {
    startDate: string;
    project: string;
  };
  title: string;
  measuredAt: string;
  temperatureFahrenheit: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: string;
  precipitations: Array<string>;
}

export interface IPrecipitations {
  id: string;
  title: string;
}

export interface IPrecipitationsPayLoad {
  id: string;
  title: string;
}

export const WeatherConditionsApi = createApi({
  reducerPath: 'WeatherConditions',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as {
        authentication: AuthenticationState;
      };
      const accessToken = state['authentication'].accessToken;
      headers.set('Authorization', `Bearer ${accessToken}`);
      return headers;
    },
  }),
  tagTypes: ['WeatherConditions'],
  endpoints: (builder) => ({
    getAllWeatherConditions: builder.query<
      DjangoRestFrameworkResult<IWeatherCondition>,
      {
        surveyMoment: {
          project: string;
          startDate: string;
        };
      }
    >({
      query: ({ surveyMoment }) => {
        return {
          url: `weather-conditions/`,
          params: {
            survey_moment__start_date: surveyMoment.startDate,
            survey_moment__project: surveyMoment.project,
          },
        };
      },
      providesTags: [{ type: 'WeatherConditions', id: 'LIST' }],
    }),
    getWeatherConditionById: builder.query<IWeatherCondition, string>({
      query: (uuid) => {
        return {
          url: `weather-conditions/${uuid}/`,
        };
      },
      providesTags: (arg) => [{ type: 'WeatherConditions', id: arg?.id }],
    }),
    createWeatherCondition: builder.mutation<
      IWeatherCondition,
      Partial<IWeatherConditionPayload>
    >({
      query: (body) => {
        return {
          url: `weather-conditions/`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: [{ type: 'WeatherConditions', id: 'LIST' }],
    }),
    updateWeatherCondition: builder.mutation<
      IWeatherCondition,
      { uuid: string; body: Partial<IWeatherConditionPayload> }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `weather-conditions/${uuid}/`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: [{ type: 'WeatherConditions', id: 'LIST' }],
    }),
    deleteWeatherCondition: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query(id) {
        return {
          url: `weather-conditions/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [{ type: 'WeatherConditions', id: 'LIST' }],
    }),
    getAllPrecipitations: builder.query<
      DjangoRestFrameworkResult<IPrecipitations>,
      unknown
    >({
      query: () => {
        return {
          url: `precipitations/`,
        };
      },
    }),
  }),
});

export const {
  useGetAllWeatherConditionsQuery,
  useGetWeatherConditionByIdQuery,
  useCreateWeatherConditionMutation,
  useUpdateWeatherConditionMutation,
  useDeleteWeatherConditionMutation,
  useGetAllPrecipitationsQuery,
} = WeatherConditionsApi;
