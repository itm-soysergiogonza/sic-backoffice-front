import { Routes } from "@angular/router";
import { VariablesPageComponent } from "./components/variables-page/variables-page.component";
import { VariablesEditComponent } from "./components/variables-edit/variables-edit.component";
import { VariablesCreateComponent } from "./components/variables-create/variables-create.component";

export const VARIABLES_ROUTES: Routes = [
  {
    path: '',
    component: VariablesPageComponent
  },
  {
    path: 'create',
    component: VariablesCreateComponent
  },
  {
    path: 'edit',
    component: VariablesEditComponent
  },
  {
    path: '**',
    redirectTo: ''
  }

];
