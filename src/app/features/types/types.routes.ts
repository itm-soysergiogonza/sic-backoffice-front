import { Routes } from '@angular/router';
import { CertificateTypeComponent } from './components/certificate-type/certificate-type.component';

export const TYPES_ROUTES: Routes = [
  {
    path: '',
    component: CertificateTypeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];
