import { Routes } from '@angular/router';
import { CertificationEditComponent } from '@features/certifications/components/certification-edit/certification-edit.component';
import { CertificationPageComponent } from './components/certifications-page/certification-page.component';

export const CERTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: CertificationPageComponent,
  },
  {
    path: ':id/editar',
    component: CertificationEditComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
