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
          import('@features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'certificados',
        loadChildren: () =>
          import('@features/certifications/certifications.routes').then(m => m.CERTIFICATIONS_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
