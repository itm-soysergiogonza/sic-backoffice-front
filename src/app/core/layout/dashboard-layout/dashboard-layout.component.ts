import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
} from '@nebular/theme';

import { HeaderComponent } from '@core/layout/header/header.component';
import { SidebarFixedComponent } from '../sidebar-fixed/sidebar-fixed.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    NbLayoutModule,
    SidebarFixedComponent,
    HeaderComponent,
    NbSidebarModule,
    NbMenuModule,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {

}

