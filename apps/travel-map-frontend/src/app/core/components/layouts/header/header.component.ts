import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
