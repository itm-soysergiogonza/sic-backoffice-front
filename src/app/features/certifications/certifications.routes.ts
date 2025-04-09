import { Routes } from '@angular/router';
import { CertificationPageComponent } from './components/certifications-page/certification-page.component';
import { CertificationDetailsComponent } from './components/certification-details/certification-details.component';

export const CERTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: CertificationPageComponent
  },
  {
    path: ':id',
    component: CertificationDetailsComponent
  }
];
