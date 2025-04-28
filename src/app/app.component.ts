import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import {
  NbButtonModule,
  NbIconModule,
  NbLayoutModule,
  NbSidebarModule,
} from '@nebular/theme';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.loginWithFakeData();
  }
}
