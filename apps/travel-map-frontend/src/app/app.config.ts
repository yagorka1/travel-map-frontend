import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { refreshInterceptor } from '@app/core/interceptors/refresh.interceptor';
import { authInterceptor } from '@app/core/interceptors/auth.interceptor';
import { endpointInterceptor } from '@app/core/interceptors/endpoint.interceptor';
import { spinnerInterceptor } from '@app/core/interceptors/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor, refreshInterceptor, endpointInterceptor, spinnerInterceptor])),
  ],
};
