import { createAction, props } from '@ngrx/store';
import { ProfileInterface } from '../../interfaces/profile.interface';

export const loadProfile = createAction('[Load Profile] Load Profile');

export const loadProfileSuccess = createAction(
  '[Load Profile] Load Profile Success',
  props<{ profile: ProfileInterface }>(),
);

export const loadProfileFailure = createAction('[Load Profile] Load Profile Failure', props<{ error: any }>());
