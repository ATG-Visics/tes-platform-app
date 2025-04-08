interface ListResult<T> {
  itemCount: number;
  itemList: Array<T>;
}

export interface DjangoRestFrameworkResult<T> {
  count: number;
  results: T[];
  next: string | null;
  previous: string | null;
}

export function mapListResult<T>(
  data?: DjangoRestFrameworkResult<T>,
): ListResult<T> {
  const { count = 0, results = [] } = data || {};

  return {
    itemCount: count,
    itemList: results,
  };
}

export function mapSingleResult<T>(djangoData?: {
  success: boolean;
  data: T;
  meta: { key: string };
}) {
  const { meta, data } = djangoData || {};

  return {
    itemCount: meta,
    singleItem: data,
  };
}

interface IFilter {
  key: string;
  value: { [key: string | number]: true };
}

interface DjangoRestFrameworkFilterParams {
  [key: string]: string;
}

export function reduceFilterList(
  filterList: IFilter[],
): DjangoRestFrameworkFilterParams {
  return filterList.reduce(
    (acc, { key, value }) => ({
      ...acc,
      [key]: Object.keys(value).join(),
    }),
    {},
  );
}
