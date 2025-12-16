import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../../enums/language.enum';

@Component({
  selector: 'lib-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
  public translate = inject(TranslateService);
  public isOpen = false;

  public readonly languages = [
    { code: LanguageEnum.EN, label: 'EN' },
    { code: LanguageEnum.RU, label: 'RU' },
    { code: LanguageEnum.BE, label: 'BE' },
  ];

  private readonly elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  public get currentLangLabel(): string {
    const currentLang = this.translate.currentLang;
    const found = this.languages.find((l) => l.code === currentLang);
    return found ? found.label : LanguageEnum.EN;
  }

  public toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  public selectLanguage(code: string): void {
    this.translate.use(code);
    localStorage.setItem('language', code);
    this.isOpen = false;
  }
}
