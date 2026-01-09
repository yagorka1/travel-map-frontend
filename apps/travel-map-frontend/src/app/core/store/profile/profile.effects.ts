import { inject } from '@angular/core';
import { LanguageService, SpinnerService } from '@app/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ProfileService } from '../../services/profile.service';
import * as ProfileActions from './profile.actions';

export const loadProfileEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService), languageService = inject(LanguageService)) => {
    return actions$.pipe(
      ofType(ProfileActions.loadProfile),
      switchMap(() =>
        profileService.getProfile().pipe(
          tap((profile) => {
            languageService.setLanguage(profile.language);
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
    languageService = inject(LanguageService),
    spinner = inject(SpinnerService),
  ) => {
    return actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap(({ profile }) =>
        spinner.show(profileService.updateProfile(profile)).pipe(
          tap((updatedProfile) => {
            if (updatedProfile.language) {
              languageService.setLanguage(updatedProfile.language);
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
