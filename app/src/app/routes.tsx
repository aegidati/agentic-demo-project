import type { RouteObject } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { HealthPage } from '../pages/HealthPage';

export const appRoutes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/health', element: <HealthPage /> }
];
