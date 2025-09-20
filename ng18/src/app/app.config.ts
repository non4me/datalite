import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {authInterceptor} from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),
    provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes)
  ]
};
