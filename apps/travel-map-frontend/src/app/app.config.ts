import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@app/auth/lib/auth/interceptors/auth.interceptor';
import { refreshInterceptor } from '@app/auth/lib/auth/interceptors/refresh.interceptor';
import { endpointInterceptor } from '@app/auth/lib/auth/interceptors/endpoint.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([authInterceptor, refreshInterceptor, endpointInterceptor])
    ),
  ],
};
