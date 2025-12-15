import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '@app/core';

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  public onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
