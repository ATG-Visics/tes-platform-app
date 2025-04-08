import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { createContext } from 'react';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from '@reduxjs/toolkit/query';
import { DjangoRestFrameworkResult } from '../djangorestframework';

interface IAPIResponse {
  id: string;
  title: string;
}

enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IInstrument {
  id: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  account: string;
}

export interface IInstrumentModel {
  id: string;
  title: string;
  instrumentType: 'chemical' | 'noise';
  instrumentSet: Array<IInstrument>;
  media: string;
  calibrationDevices: Array<{
    id: string;
    title: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface IInstrumentPayload {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  search: string;
  filterParams?: { [key: string]: string };
}

export interface ICalibration {
  id: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
  model: string;
  account: string;
}

export interface ICalibrationModel {
  id: string;
  title: string;
  calibrationInstrumentSet: Array<ICalibration>;
  createdAt: string;
  updatedAt: string;
}

interface ICalibrationPayload {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  search: string;
  filterParams?: { [key: string]: string };
}

export interface IOelSource {
  id: string;
  model: string;
  title: string;
}

export interface IOelSourceModel {
  id: string;
  title: string;
  oelSourceSet: Array<IOelSource>;
}

interface IOelSourcePayload {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  search: string;
  filterParams?: { [key: string]: string };
}

interface IProps {
  hazardType?: string;
  useGetAllQuery?: UseQuery<
    QueryDefinition<
      {
        searchTitle?: string;
      },
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      string,
      DjangoRestFrameworkResult<IAPIResponse>,
      string
    >
  >;
  useGetAllMediaQuery?: UseQuery<
    QueryDefinition<
      {
        searchTitle?: string;
      },
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      string,
      DjangoRestFrameworkResult<IAPIResponse>,
      string
    >
  >;
  useGetAllInstrumentsQuery?: UseQuery<
    QueryDefinition<
      IInstrumentPayload,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      string,
      DjangoRestFrameworkResult<IInstrumentModel>,
      string
    >
  >;
  useGetAllCalibrationInstrumentsQuery?: UseQuery<
    QueryDefinition<
      ICalibrationPayload,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      string,
      DjangoRestFrameworkResult<ICalibrationModel>,
      string
    >
  >;
  useGetAllOelSourceQuery?: UseQuery<
    QueryDefinition<
      IOelSourcePayload,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      string,
      DjangoRestFrameworkResult<IOelSourceModel>,
      string
    >
  >;
}

export type DynamicAPIContextProps = IProps;

export const DynamicAPIContext = createContext<IProps | null>(null);
