import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from '@core/layout/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@features/dashboard/dashboard.routes').then(
            (m): Routes => m.DASHBOARD_ROUTES,
          ),
      },
      {
        path: 'plantillas',
        loadChildren: () =>
          import('@features/templates/templates.routes').then(
            (m): Routes => m.CERTIFICATIONS_ROUTES,
          ),
      },
      {
        path: 'parametros',
        loadChildren: () =>
          import('@features/parameters/parameters.routes').then(
            (m): Routes => m.PARAMETERS_ROUTES,
          ),
      },
      {
        path: 'variables',
        loadChildren: () =>
          import('@features/variables/variables.routes').then(
            (m): Routes => m.VARIABLES_ROUTES,
          ),
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
