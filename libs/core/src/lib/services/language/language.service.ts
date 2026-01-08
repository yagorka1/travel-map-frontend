import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../../enums/language.enum';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);

  public init(): void {
    let lang = LanguageEnum.EN;

    if (isPlatformBrowser(this.platformId)) {
      lang = (localStorage.getItem('language') as LanguageEnum) ?? LanguageEnum.EN;
    }

    this.setLanguage(lang);
  }

  public setLanguage(code: string): void {
    this.translate.use(code);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', code);
    }
  }

  public get currentLang(): string {
    return this.translate.currentLang;
  }
}
