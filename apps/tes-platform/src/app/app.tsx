import { Route, Routes, Navigate } from 'react-router-dom';
import { MuiApp } from '@tes/ui/app';
import { ICustomRoute, routes } from '@tes/router';
import { withLoginGuard } from '@tes/authentication';
import { Suspense } from 'react';
import { componentMapping } from './ComponentMapping';

const renderRoutes = (routes: ICustomRoute[]) => {
  return routes.map((route, index) => {
    const Component = componentMapping[route.name];
    return (
      <Route
        key={index}
        path={route.path}
        element={Component ? <Component /> : <div>404 Not found</div>}
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
};

export function BaseApp() {
  return (
    <MuiApp>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {renderRoutes(routes)}
        </Routes>
      </Suspense>
    </MuiApp>
  );
}

export const App = withLoginGuard(BaseApp);

export default App;
