import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ProfileActions from './profile.actions';
import { inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { TranslateService } from '@ngx-translate/core';

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
          tap((profile) => translateService.use(profile.language)),
          map((profile) => ProfileActions.loadProfileSuccess({ profile })),
          catchError((error) => of(ProfileActions.loadProfileFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateProfileEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) => {
    return actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap(({ profile }) =>
        profileService.updateProfile(profile).pipe(
          map((updatedProfile) => ProfileActions.updateProfileSuccess({ profile: updatedProfile })),
          catchError((error) => of(ProfileActions.updateProfileFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);
