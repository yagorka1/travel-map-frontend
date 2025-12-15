import { provideHttpClient, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LanguageEnum } from '@app/core';
import { authInterceptor } from '@app/core/interceptors/auth.interceptor';
import { endpointInterceptor } from '@app/core/interceptors/endpoint.interceptor';
import { errorInterceptor } from '@app/core/interceptors/error.interceptor';
import { refreshInterceptor } from '@app/core/interceptors/refresh.interceptor';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { appRoutes } from './app.routes';
import * as ProfileEffects from './core/store/profile/profile.effects';
import { profileReducer } from './core/store/profile/profile.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor, refreshInterceptor, endpointInterceptor, errorInterceptor])),
    provideTranslateService({
      lang: localStorage.getItem('language') || LanguageEnum.EN,
      fallbackLang: LanguageEnum.EN,
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json',
      }),
    }),
    provideStore({
      profile: profileReducer,
    }),
    provideEffects(ProfileEffects),
  ],
};
