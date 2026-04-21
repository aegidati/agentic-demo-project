import type { RouteObject } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { HealthPage } from '../pages/HealthPage';
import { MembershipsPage } from '../pages/MembershipsPage';

export const appRoutes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/health', element: <HealthPage /> },
  { path: '/memberships', element: <MembershipsPage /> }
];
