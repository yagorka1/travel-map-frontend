import { TestBed } from '@angular/core/testing';
import { ThemeEnum, ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jest.SpyInstance;
  let matchMediaSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock localStorage
    localStorageSpy = jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'setItem');

    // Mock matchMedia
    matchMediaSpy = jest.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaSpy,
    });

    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme when no preference is set', () => {
    localStorageSpy.mockReturnValue(null);
    matchMediaSpy.mockReturnValue({ matches: false });

    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe(ThemeEnum.LIGHT);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should initialize with dark theme from localStorage', () => {
    localStorageSpy.mockReturnValue(ThemeEnum.DARK);

    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe(ThemeEnum.DARK);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle theme from light to dark', () => {
    localStorageSpy.mockReturnValue(ThemeEnum.LIGHT);
    service = TestBed.inject(ThemeService);

    service.toggleTheme();

    expect(service.getCurrentTheme()).toBe(ThemeEnum.DARK);
    expect(localStorage.setItem).toHaveBeenCalledWith('color-theme', ThemeEnum.DARK);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle theme from dark to light', () => {
    localStorageSpy.mockReturnValue(ThemeEnum.DARK);
    service = TestBed.inject(ThemeService);

    service.toggleTheme();

    expect(service.getCurrentTheme()).toBe(ThemeEnum.LIGHT);
    expect(localStorage.setItem).toHaveBeenCalledWith('color-theme', ThemeEnum.LIGHT);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should set theme to dark', () => {
    localStorageSpy.mockReturnValue(ThemeEnum.LIGHT);
    service = TestBed.inject(ThemeService);

    service.setTheme(ThemeEnum.DARK);

    expect(service.getCurrentTheme()).toBe(ThemeEnum.DARK);
    expect(localStorage.setItem).toHaveBeenCalledWith('color-theme', ThemeEnum.DARK);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should emit theme changes', (done) => {
    localStorageSpy.mockReturnValue(ThemeEnum.LIGHT);
    service = TestBed.inject(ThemeService);

    service.theme$.subscribe((theme) => {
      if (theme === ThemeEnum.DARK) {
        expect(theme).toBe(ThemeEnum.DARK);
        done();
      }
    });

    service.setTheme(ThemeEnum.DARK);
  });
});
