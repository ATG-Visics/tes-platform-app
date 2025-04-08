import { useNavigate, useParams } from 'react-router-dom';
import { ICustomRoute, routes } from '../routes';

interface NavigateOptions {
  params?: Record<string, string>;
  query?: Record<string, string>;
  useExistingParams?: boolean;
}

export const useCustomNavigate = () => {
  const navigate = useNavigate();
  const existingParams = useParams();

  const findRouteByName = (
    routes: ICustomRoute[],
    routeName: string,
  ): ICustomRoute | null => {
    for (const route of routes) {
      if (route.name === routeName) {
        return route;
      }
      if (route.children) {
        const childRoute = findRouteByName(route.children, routeName);
        if (childRoute) {
          return childRoute;
        }
      }
    }
    return null;
  };

  const navigateToRoute = (
    nameOrSteps: string | number,
    options?: NavigateOptions,
  ) => {
    if (typeof nameOrSteps === 'number') {
      navigate(nameOrSteps);
      return;
    }

    const route = findRouteByName(routes, nameOrSteps);

    if (!route) {
      console.warn(`Route with name ${nameOrSteps} not found.`);
      return;
    }

    const useExistingParams =
      options?.useExistingParams === undefined
        ? true
        : options?.useExistingParams;

    const path = getRoutePath(
      nameOrSteps,
      options?.params,
      options?.query,
      useExistingParams,
    );

    navigate(path);
  };

  const replaceParams = (
    path: string,
    params: Record<string, string>,
    useExistingParams: boolean,
  ): string => {
    return path.replace(/:(\w+)/g, (_, key) => {
      if (params[key]) {
        return params[key];
      }
      if (useExistingParams && existingParams[key]) {
        return existingParams[key] ?? `:${key}`;
      }
      return `:${key}`;
    });
  };

  const buildQueryString = (query: Record<string, string> = {}): string => {
    const queryString = new URLSearchParams(query).toString();
    return queryString ? `?${queryString}` : '';
  };

  const getFullRoutePath = (
    routes: ICustomRoute[],
    routeName: string,
    params: Record<string, string>,
    useExistingParams: boolean,
  ): string | null => {
    let pathStack: string[] = [];

    const findRouteAndBuildPath = (
      routes: ICustomRoute[],
      name: string,
    ): boolean => {
      for (const route of routes) {
        if (route.name === name) {
          pathStack.push(route.path);
          return true;
        }

        if (route.children) {
          const foundInChildren = findRouteAndBuildPath(route.children, name);
          if (foundInChildren) {
            pathStack.push(route.path);
            return true;
          }
        }
      }
      return false;
    };

    const routeFound = findRouteAndBuildPath(routes, routeName);
    if (!routeFound) {
      return null;
    }

    pathStack = pathStack.reverse();

    let fullPath = pathStack.join('/');
    while (fullPath.startsWith('//')) {
      fullPath = fullPath.slice(1);
    }
    fullPath = replaceParams(fullPath, params, useExistingParams);
    return fullPath;
  };

  const getRoutePath = (
    name: string,
    params: Record<string, string> = {},
    query: Record<string, string> = {},
    useExistingParams: boolean,
  ): string => {
    const route = findRouteByName(routes, name);
    if (!route) {
      throw new Error(`Route with name ${name} not found`);
    }

    let fullPath = getFullRoutePath(routes, name, params, useExistingParams);
    if (!fullPath) {
      throw new Error(`Failed to build full path for route ${name}`);
    }

    const queryString = buildQueryString(query);
    if (!fullPath.startsWith('/')) {
      fullPath = `/${fullPath}`;
    }

    return `${fullPath}/${queryString}`;
  };

  return {
    navigateToRoute,
    getRoutePath,
  };
};
