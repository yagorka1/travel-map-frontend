import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should have default values', () => {
      expect(component.src).toBeUndefined();
      expect(component.name).toBe('User');
      expect(component.size).toBe('md');
      expect(component.alt).toBe('User avatar');
    });

    it('should accept custom src', () => {
      component.src = 'path/to/avatar.jpg';
      expect(component.src).toBe('path/to/avatar.jpg');
    });

    it('should accept custom name', () => {
      component.name = 'John Doe';
      expect(component.name).toBe('John Doe');
    });

    it('should accept custom size', () => {
      component.size = 'lg';
      expect(component.size).toBe('lg');
    });

    it('should accept custom alt text', () => {
      component.alt = 'Profile picture';
      expect(component.alt).toBe('Profile picture');
    });
  });

  describe('formattedSrc getter', () => {
    it('should return null when src is undefined', () => {
      component.src = undefined;
      expect(component.formattedSrc).toBeNull();
    });

    it('should return null when src is null', () => {
      component.src = null;
      expect(component.formattedSrc).toBeNull();
    });

    it('should return null when src is empty string', () => {
      component.src = '';
      expect(component.formattedSrc).toBeNull();
    });

    it('should return full URL as-is when src starts with http://', () => {
      component.src = 'http://example.com/avatar.jpg';
      expect(component.formattedSrc).toBe('http://example.com/avatar.jpg');
    });

    it('should return full URL as-is when src starts with https://', () => {
      component.src = 'https://example.com/avatar.jpg';
      expect(component.formattedSrc).toBe('https://example.com/avatar.jpg');
    });

    it('should prepend server URL for relative paths', () => {
      component.src = 'uploads/avatar.jpg';
      expect(component.formattedSrc).toBe('http://localhost:3000/uploads/avatar.jpg');
    });

    it('should normalize backslashes to forward slashes', () => {
      component.src = 'uploads\\avatars\\user.jpg';
      expect(component.formattedSrc).toBe('http://localhost:3000/uploads/avatars/user.jpg');
    });

    it('should handle mixed path separators', () => {
      component.src = 'uploads\\user/avatar.jpg';
      expect(component.formattedSrc).toBe('http://localhost:3000/uploads/user/avatar.jpg');
    });
  });

  describe('initials getter', () => {
    it('should return first character of name in uppercase', () => {
      component.name = 'John';
      expect(component.initials).toBe('J');
    });

    it('should convert lowercase to uppercase', () => {
      component.name = 'alice';
      expect(component.initials).toBe('A');
    });

    it('should handle single character names', () => {
      component.name = 'x';
      expect(component.initials).toBe('X');
    });

    it('should handle default name', () => {
      expect(component.initials).toBe('U');
    });

    it('should handle names with spaces', () => {
      component.name = 'John Doe';
      expect(component.initials).toBe('J');
    });

    it('should handle special characters', () => {
      component.name = '@user123';
      expect(component.initials).toBe('@');
    });
  });

  describe('sizeClasses getter', () => {
    it('should return small size classes', () => {
      component.size = 'sm';
      expect(component.sizeClasses).toBe('w-8 h-8 text-sm');
    });

    it('should return medium size classes (default)', () => {
      component.size = 'md';
      expect(component.sizeClasses).toBe('w-10 h-10 text-base');
    });

    it('should return large size classes', () => {
      component.size = 'lg';
      expect(component.sizeClasses).toBe('w-16 h-16 text-xl');
    });

    it('should return extra large size classes', () => {
      component.size = 'xl';
      expect(component.sizeClasses).toBe('w-32 h-32 text-5xl');
    });
  });

  describe('Template rendering', () => {
    it('should render initials when no src is provided', () => {
      component.name = 'Test User';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const initialsElement = compiled.querySelector('span');

      expect(initialsElement).toBeTruthy();
      expect(initialsElement?.textContent?.trim()).toBe('T');
    });

    it('should render image when src is provided', () => {
      component.src = 'https://example.com/avatar.jpg';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const imgElement = compiled.querySelector('img');

      expect(imgElement).toBeTruthy();
      expect(imgElement?.getAttribute('src')).toBe('https://example.com/avatar.jpg');
    });

    it('should apply size classes to container', () => {
      component.size = 'lg';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const container = compiled.querySelector('div');

      expect(container?.classList.contains('w-16')).toBe(true);
      expect(container?.classList.contains('h-16')).toBe(true);
    });

    it('should set alt attribute on image', () => {
      component.src = 'avatar.jpg';
      component.alt = 'Custom alt text';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const imgElement = compiled.querySelector('img');

      expect(imgElement?.getAttribute('alt')).toBe('Custom alt text');
    });

    it('should apply gradient background to initials fallback', () => {
      component.src = null;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const fallbackDiv = compiled.querySelector('div.bg-gradient-to-br');

      expect(fallbackDiv).toBeTruthy();
      expect(fallbackDiv?.classList.contains('from-purple-600')).toBe(true);
      expect(fallbackDiv?.classList.contains('to-blue-500')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long names', () => {
      component.name = 'VeryLongNameThatExceedsNormalLength';
      expect(component.initials).toBe('V');
    });

    it('should handle empty name gracefully', () => {
      component.name = '';
      expect(component.initials).toBe('');
    });

    it('should switch from image to initials when src is cleared', () => {
      component.src = 'avatar.jpg';
      fixture.detectChanges();

      let imgElement = fixture.nativeElement.querySelector('img');
      expect(imgElement).toBeTruthy();

      component.src = null;
      fixture.detectChanges();

      imgElement = fixture.nativeElement.querySelector('img');
      const initialsElement = fixture.nativeElement.querySelector('span');

      expect(imgElement).toBeFalsy();
      expect(initialsElement).toBeTruthy();
    });
  });
});
