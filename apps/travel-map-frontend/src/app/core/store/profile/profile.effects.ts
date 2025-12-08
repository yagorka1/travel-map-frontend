import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ProfileService } from '../../services/profile.service';
import * as ProfileActions from './profile.actions';

export const loadProfileEffect = createEffect(
  (
    actions$ = inject(Actions),
    profileService = inject(ProfileService),
    translateService = inject(TranslateService),
  ) => {
    return actions$.pipe(
      ofType(ProfileActions.loadProfile),
      switchMap(() =>
        profileService.getProfile().pipe(
          tap((profile) => {
            localStorage.setItem('language', profile.language);
            translateService.use(profile.language);
          }),
          map((profile) => ProfileActions.loadProfileSuccess({ profile })),
          catchError((error) => of(ProfileActions.loadProfileFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateProfileEffect = createEffect(
  (
    actions$ = inject(Actions),
    profileService = inject(ProfileService),
    translateService = inject(TranslateService),
  ) => {
    return actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap(({ profile }) =>
        profileService.updateProfile(profile).pipe(
          tap((updatedProfile) => {
            if (updatedProfile.language) {
              localStorage.setItem('language', updatedProfile.language);
              translateService.use(updatedProfile.language);
            }
          }),
          map((updatedProfile) => ProfileActions.updateProfileSuccess({ profile: updatedProfile })),
          catchError((error) => of(ProfileActions.updateProfileFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);
