import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppListService } from '@core/services/app-list.service';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { Observable } from 'rxjs';

interface AppItem {
  name: string;
  icon: string;
  logo: string;
  url: string;
  isExternal?: boolean;
}

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [
    CommonModule,
    NbButtonModule,
    NbIconModule,
    NbEvaIconsModule,
    RouterLink,
  ],
  templateUrl: './app-hub.component.html',
  styleUrl: './app-hub.component.scss',
})
export class AppHubComponent implements OnInit {
  @Output() closeHub = new EventEmitter<void>();

  apps$!: Observable<AppItem[]>;
  apps: AppItem[] = [];

  constructor(private _appListService: AppListService) {}

  ngOnInit() {
    this.apps$ = this._appListService.getApplications();
    this.apps$.subscribe({
      next: (data) => {
        this.apps = data;
      },
      error: (err) => {
        console.error('Error loading apps:', err);
      },
    });
  }

  onCloseHub() {
    this.closeHub.emit();
  }

  openLink(app: AppItem) {
    if (app.isExternal) {
      window.open(app.url, '_blank');
    }
  }
}
