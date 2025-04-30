import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NbButtonModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuItem,
  NbMenuModule,
  NbSidebarModule,
  NbThemeService,
  NbTooltipModule,
} from '@nebular/theme';

type ThemeOption = 'default' | 'cosmic';

@Component({
  selector: 'nb-sidebar-fixed',
  imports: [
    CommonModule,
    NbLayoutModule,
    NbButtonModule,
    NbSidebarModule,
    NbIconModule,
    NbMenuModule,
    NbTooltipModule,
    NgOptimizedImage,
  ],
  templateUrl: './sidebar-fixed.component.html',
  styleUrl: './sidebar-fixed.component.scss',
  animations: [
    trigger('collapseAnimation', [
      state('expanded', style({ width: '240px' })),
      state('collapsed', style({ width: '80px' })),
      transition('expanded <=> collapsed', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class SidebarFixedComponent implements OnInit {
  menuItems: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/dashboard',
    },
    {
      title: 'Gestión de Certificados',
      icon: 'file-text-outline',
      expanded: true,
      children: [
        {
          title: 'Tipos de Certificados',
          icon: 'settings-outline',
          link: '/tipos',
        },
        {
          title: 'Parámetros',
          icon: 'settings-outline',
          link: '/parametros',
        },
        {
          title: 'Variables',
          icon: 'settings-outline',
          link: '/variables',
        },
        {
          title: 'Plantillas',
          icon: 'code',
          link: '/plantillas',
        },
      ],
    },
  ];
  logoURL = '/assets/images/LogoITMSmallBlue.svg';

  constructor(private _themeService: NbThemeService) {}

  ngOnInit(): void {
    this.setupThemeListener();
  }

  private setupThemeListener(): void {
    const currentTheme = this._themeService.currentTheme;
    if (currentTheme) {
      this.updateLogo(currentTheme as ThemeOption);
    }

    this._themeService.onThemeChange().subscribe((theme) => {
      this.updateLogo(theme.name as ThemeOption);
    });
  }

  private updateLogo(theme: ThemeOption): void {
    this.logoURL =
      theme === 'cosmic'
        ? '/assets/images/LogoITMSmallWhite.svg'
        : '/assets/images/LogoITMSmallBlue.svg';
  }
}
