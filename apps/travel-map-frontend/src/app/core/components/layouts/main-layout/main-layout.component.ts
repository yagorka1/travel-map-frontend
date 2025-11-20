import { Component, inject } from '@angular/core';
import { AsideMenuComponent } from '../aside-menu/aside-menu.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadProfile } from '../../../store/profile/profile.actions';

@Component({
  selector: 'app-main-layout',
  imports: [AsideMenuComponent, HeaderComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private store = inject(Store);

  constructor() {
    this.store.dispatch(loadProfile());
  }
}
