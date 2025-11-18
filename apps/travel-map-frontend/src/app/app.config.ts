import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { refreshInterceptor } from '@app/core/interceptors/refresh.interceptor';
import { authInterceptor } from '@app/core/interceptors/auth.interceptor';
import { endpointInterceptor } from '@app/core/interceptors/endpoint.interceptor';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageEnum } from '@app/core';
import { errorInterceptor } from '@app/core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor, refreshInterceptor, endpointInterceptor, errorInterceptor])),
    provideTranslateService({
      lang: LanguageEnum.EN,
      fallbackLang: LanguageEnum.EN,
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
