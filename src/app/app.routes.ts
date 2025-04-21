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
        path: 'certificados',
        loadChildren: () =>
          import('@features/certifications/certifications.routes').then(
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
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
