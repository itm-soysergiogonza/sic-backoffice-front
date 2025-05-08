import { Routes } from '@angular/router';
import { ParametersPageComponent } from '@features/parameters/components/parameters-page/parameters-page.component';
import { ParameterModalComponent } from './components/parameter-modal/parameter-modal.component';

export const PARAMETERS_ROUTES: Routes = [
  {
    path: '',
    component: ParametersPageComponent,
  },
  {
    path: 'crear',
    component: ParameterModalComponent,
  },
];
