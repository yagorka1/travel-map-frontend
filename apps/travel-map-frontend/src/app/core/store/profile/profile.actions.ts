import { createAction, props } from '@ngrx/store';
import { ProfileInterface, UpdateProfileDto } from '../../interfaces/profile.interface';

export const loadProfile = createAction('[Load Profile] Load Profile');

export const loadProfileSuccess = createAction(
  '[Load Profile] Load Profile Success',
  props<{ profile: ProfileInterface }>(),
);

export const loadProfileFailure = createAction('[Load Profile] Load Profile Failure', props<{ error: unknown }>());

export const updateProfile = createAction('[Update Profile] Update Profile', props<{ profile: UpdateProfileDto }>());

export const updateProfileSuccess = createAction(
  '[Update Profile] Update Profile Success',
  props<{ profile: ProfileInterface }>(),
);

export const updateProfileFailure = createAction(
  '[Update Profile] Update Profile Failure',
  props<{ error: unknown }>(),
);
