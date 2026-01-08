import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
}

export type Theme = ThemeEnum.LIGHT | ThemeEnum.DARK;

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'color-theme';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly theme = signal<Theme>(this.getInitialTheme());
  public readonly theme$ = toObservable(this.theme);

  constructor() {
    this.applyTheme(this.theme());
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getInitialTheme(): Theme {
    let savedTheme;

    if (this.isBrowser()) {
      savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    }

    if (savedTheme === ThemeEnum.DARK || savedTheme === ThemeEnum.LIGHT) {
      return savedTheme;
    }

    return ThemeEnum.LIGHT;
  }

  public getCurrentTheme(): Theme {
    return this.theme();
  }

  public toggleTheme(): void {
    const newTheme: Theme = this.theme() === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    this.setTheme(newTheme);
  }

  public setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    if (this.isBrowser()) {
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser()) {
      return;
    }
    const htmlElement = document.documentElement;
    if (theme === ThemeEnum.DARK) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
