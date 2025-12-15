import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { selectProfile } from '../../../../core/store/profile/profile.selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ProfileInterface } from '../../../../core/interfaces/profile.interface';

@UntilDestroy()
@Component({
  selector: 'app-settings',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private store = inject(Store);

  public profile: ProfileInterface | null = null;

  public ngOnInit(): void {
    this.store
      .select(selectProfile)
      .pipe(untilDestroyed(this))
      .subscribe((profile: ProfileInterface | null) => {
        this.profile = profile;
      });
  }
}
