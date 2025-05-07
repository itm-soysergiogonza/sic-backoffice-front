import { Routes } from '@angular/router';
import { ParametersPageComponent } from '@features/parameters/components/parameters-page/parameters-page.component';
import { CreateComponent } from './components/create/create.component';

export const PARAMETERS_ROUTES: Routes = [
  {
    path: '',
    component: ParametersPageComponent,
  },
  {
    path: 'crear',
    component: CreateComponent
  }
];
