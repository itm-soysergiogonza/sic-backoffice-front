import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';
import {
  NbActionsModule,
  NbButtonModule,
  NbContextMenuModule,
  NbIconModule,
  NbLayoutModule,
  NbSidebarService,
  NbThemeService,
  NbUserModule,
} from '@nebular/theme';
import { AppHubComponent } from '../app-hub/app-hub.component';
import { ContextMenuClickComponent } from '../context-menu/context-menu.component';

type ThemeOption = 'default' | 'cosmic';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NbLayoutModule,
    NbActionsModule,
    NbUserModule,
    NbIconModule,
    NbEvaIconsModule,
    NgOptimizedImage,
    NbContextMenuModule,
    NbSecurityModule,
    ContextMenuClickComponent,
    NbButtonModule,
    AppHubComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  logoURL = '/assets/images/LogoWhite.svg';
  showAppHub = false;

  constructor(
    private themeService: NbThemeService,
    private _sidebarService: NbSidebarService,
  ) {}

  ngOnInit(): void {
    this.setupThemeListener();
  }

  private setupThemeListener(): void {
    const currentTheme = this.themeService.currentTheme;
    if (currentTheme) {
      this.updateLogo(currentTheme as ThemeOption);
    }

    this.themeService.onThemeChange().subscribe((theme) => {
      this.updateLogo(theme.name as ThemeOption);
    });
  }

  private updateLogo(theme: ThemeOption): void {
    this.logoURL =
      theme === 'cosmic'
        ? '/assets/images/LogoWhite.svg'
        : '/assets/images/LogoBlue.svg';
  }

  toggle() {
    this._sidebarService.toggle(true, 'left');
  }

  toggleAppHub() {
    this.showAppHub = !this.showAppHub;
  }

  onCloseAppHub() {
    this.showAppHub = false;
  }
}
