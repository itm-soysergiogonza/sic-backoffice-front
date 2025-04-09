import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbButtonModule, NbIconModule } from '@nebular/theme';

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
export class AppHubComponent {
  @Output() closeHub = new EventEmitter<void>();

  apps: AppItem[] = [
    {
      name: 'SIC',
      icon: 'file-text-outline',
      logo: '',
      url: '/sic',
    },
    {
      name: 'SIA',
      icon: 'book-open-outline',
      logo: '',
      url: '/sia',
    },
    {
      name: 'SIB',
      icon: 'award-outline',
      logo: '',
      url: '/sib',
    },
  ];

  onCloseHub() {
    this.closeHub.emit();
  }

  openLink(app: AppItem) {
    if (app.isExternal) {
      window.open(app.url, '_blank');
    }
  }
}
