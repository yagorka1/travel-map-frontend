import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'lib-avatar',
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() src?: string | null | undefined;
  @Input() name = 'User';
  @Input() size: AvatarSize = 'md';
  @Input() alt = 'User avatar';

  get formattedSrc(): string | null {
    if (!this.src) {
      return null;
    }
    // If the src is already a full URL, return it as-is
    if (this.src.startsWith('http://') || this.src.startsWith('https://')) {
      return this.src;
    }
    // Otherwise, prepend the server URL and normalize path separators
    return `http://localhost:3000/${this.src.replace(/\\/g, '/')}`;
  }

  get initials(): string {
    return this.name.charAt(0).toUpperCase();
  }

  get sizeClasses(): string {
    const sizes = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-16 h-16 text-xl',
      xl: 'w-32 h-32 text-5xl',
    };
    return sizes[this.size];
  }
}
