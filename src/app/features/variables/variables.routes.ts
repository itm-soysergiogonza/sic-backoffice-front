import { Routes } from "@angular/router";
import { VariablesPageComponent } from "./components/variables-page/variables-page.component";

export const VARIABLES_ROUTES: Routes = [
  {
    path: '',
    component: VariablesPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
