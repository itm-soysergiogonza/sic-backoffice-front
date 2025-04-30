import { Routes } from '@angular/router';
import { TemplateEditComponent } from './components/template-edit/template-edit.component';
import { TemplatePageComponent } from './components/template-page/template-page.component';
import { TemplateCreateComponent } from './components/template-create/template-create.component';

export const CERTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: TemplatePageComponent,
  },
  {
    path: ':id/editar',
    component: TemplateEditComponent,
  },
  {
    path: 'crear',
    component: TemplateCreateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
