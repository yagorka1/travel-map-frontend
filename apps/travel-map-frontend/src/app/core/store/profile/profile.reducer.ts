import { createReducer, on } from '@ngrx/store';
import * as ProfileActions from './profile.actions';
import { ProfileInterface } from '../../../pages/settings/interfaces/profile.interface';

export const PROFILE_FEATURE_KEY = 'profile';

export interface ProfileState {
  profile: ProfileInterface | null;
  loading: boolean;
  error: unknown;
}

export const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const profileReducer = createReducer(
  initialState,

  on(ProfileActions.loadProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProfileActions.loadProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
    error: null,
  })),

  on(ProfileActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProfileActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProfileActions.updateProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
    error: null,
  })),

  on(ProfileActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
