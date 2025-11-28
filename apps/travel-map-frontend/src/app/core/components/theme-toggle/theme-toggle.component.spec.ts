import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Theme, ThemeEnum, ThemeService } from '../../services/theme.service';
import { ThemeToggleComponent } from './theme-toggle.component';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: jest.Mocked<ThemeService>;
  let themeSubject: BehaviorSubject<Theme>;

  beforeEach(async () => {
    themeSubject = new BehaviorSubject<Theme>(ThemeEnum.LIGHT);

    const themeServiceMock = {
      theme$: themeSubject.asObservable(),
      toggleTheme: jest.fn(),
      getCurrentTheme: jest.fn().mockReturnValue(ThemeEnum.LIGHT),
      setTheme: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent, TranslateModule.forRoot()],
      providers: [{ provide: ThemeService, useValue: themeServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current theme', () => {
    expect(component.currentTheme()).toBe(ThemeEnum.LIGHT);
  });

  it('should update currentTheme when theme changes', () => {
    themeSubject.next(ThemeEnum.DARK);
    fixture.detectChanges();
    expect(component.currentTheme()).toBe(ThemeEnum.DARK);
  });

  it('should call toggleTheme when button is clicked', () => {
    component.toggleTheme();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should display moon icon in light mode', () => {
    // currentTheme is already 'light' by default
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const moonIcon = compiled.querySelector('svg path[d*="17.293"]');
    expect(moonIcon).toBeTruthy();
  });

  it('should display sun icon in dark mode', () => {
    themeSubject.next(ThemeEnum.DARK);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const sunIcon = compiled.querySelector('svg path[fill-rule="evenodd"]');
    expect(sunIcon).toBeTruthy();
  });
});
