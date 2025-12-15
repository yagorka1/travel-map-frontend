import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { environment } from '@env/environment';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'lib-avatar',
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() src?: string | null | undefined;
  @Input() updatedSrc?: string | null | undefined;
  @Input() name = 'User';
  @Input() size: AvatarSize = 'md';
  @Input() alt = 'User avatar';

  public imageLoadError = false;

  public get formattedSrc(): string | null {
    if (!this.src || this.imageLoadError) {
      return null;
    }

    if (this.src.startsWith('http://') || this.src.startsWith('https://')) {
      return this.src;
    }

    return `${environment.apiWebSocketHost}/${this.src.replace(/\\/g, '/')}`;
  }

  public get initials(): string {
    return this.name.charAt(0).toUpperCase();
  }

  public get sizeClasses(): string {
    const sizes = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-16 h-16 text-xl',
      xl: 'w-32 h-32 text-5xl',
    };
    return sizes[this.size];
  }

  public onImageError(): void {
    this.imageLoadError = true;
  }
}
