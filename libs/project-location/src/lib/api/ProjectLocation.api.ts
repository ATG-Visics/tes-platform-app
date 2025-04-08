import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { AuthenticationState } from '@tes/authentication';

export interface IProjectLocation {
  id: string;
  title: string;
  contactPerson: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  project: {
    id: string;
    description: string;
  };
  floorPlan: string | null;
  addressSameAs: boolean;
  contactSameAs: boolean;
}

export interface IProjectLocationCreatePayload {
  id: string;
  title: string;
  contactPerson: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  project: string;
  addressSameAs: boolean;
  contactSameAs: boolean;
  floorPlan: string | null;
}

export const ProjectLocationApi = createApi({
  reducerPath: 'ProjectLocationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState() as { authentication: AuthenticationState };
      const accessToken = state['authentication'].accessToken;
      headers.set('Authorization', `Bearer ${accessToken}`);
      return headers;
    },
  }),
  tagTypes: ['ProjectLocations'],
  endpoints: (builder) => ({
    createProjectLocation: builder.mutation<
      IProjectLocation,
      Partial<IProjectLocationCreatePayload>
    >({
      query: (body) => {
        return {
          url: `project-locations/`,
          method: 'POST',
          body,
        };
      },
    }),
    getProjectLocationById: builder.query<
      IProjectLocationCreatePayload,
      string
    >({
      query: (uuid) => `projects/${uuid}`,
      transformResponse: (response: IProjectLocation) => {
        return { ...response, project: response.project.id };
      },
    }),
    updateProjectLocation: builder.mutation<
      IProjectLocation,
      { uuid: string; body: Partial<IProjectLocationCreatePayload> }
    >({
      query: (params) => {
        const { uuid, body } = params;
        return {
          url: `project-locations/${uuid}/`,
          method: 'PUT',
          body: body,
        };
      },
    }),
    deleteProjectLocation: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query(id) {
        return {
          url: `project-locations/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [{ type: 'ProjectLocations', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateProjectLocationMutation,
  useGetProjectLocationByIdQuery,
  useUpdateProjectLocationMutation,
  useDeleteProjectLocationMutation,
} = ProjectLocationApi;
