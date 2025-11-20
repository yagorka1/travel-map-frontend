import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../../../core/store/profile/profile.selectors';
import * as ProfileActions from '../../../../core/store/profile/profile.actions';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private store = inject(Store);

  constructor() {
    this.store.select(selectProfile).subscribe((profile) => {
      console.log(profile);
    });

    //  this.store.dispatch(ProfileActions.loadProfile());
  }
}
