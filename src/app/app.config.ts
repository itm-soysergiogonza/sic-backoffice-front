import {
  type ApplicationConfig,
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import {
  NbBadgeModule,
  NbCardModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbLayoutModule,
  NbDialogModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

const NEBULAR_MODULES: (Provider | EnvironmentProviders)[] = [
  ...NbThemeModule.forRoot({ name: 'default' }).providers || [],
  ...NbSidebarModule.forRoot().providers || [],
  ...NbMenuModule.forRoot().providers || [],
  ...NbDialogModule.forRoot().providers || [],
  importProvidersFrom(
    NbCardModule,
    NbBadgeModule,
    NbLayoutModule,
    NbEvaIconsModule
  ),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    ...NEBULAR_MODULES,
    importProvidersFrom(
      BrowserAnimationsModule
    )
  ],
};
