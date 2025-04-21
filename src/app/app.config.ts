import {
  type ApplicationConfig,
  EnvironmentProviders,
  Provider,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbBadgeModule,
  NbCardHeaderComponent,
  NbCardModule,
  NbDialogModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbTreeGridModule,
} from '@nebular/theme';
import { provideCodeEditor } from '@ngstack/code-editor';
import { routes } from './app.routes';

const NEBULAR_MODULES: (Provider | EnvironmentProviders)[] = [
  ...(NbThemeModule.forRoot({ name: 'default' }).providers || []),
  ...(NbSidebarModule.forRoot().providers || []),
  ...(NbMenuModule.forRoot().providers || []),
  ...(NbDialogModule.forRoot().providers || []),
  importProvidersFrom(
    NbCardModule,
    NbBadgeModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbTreeGridModule,
    NbCardHeaderComponent,
  ),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    ...NEBULAR_MODULES,
    importProvidersFrom(BrowserAnimationsModule),
    provideCodeEditor({
      baseUrl: 'assets/monaco',
      typingsWorkerUrl: 'assets/workers/typings-worker.js',
    }),
  ],
};
