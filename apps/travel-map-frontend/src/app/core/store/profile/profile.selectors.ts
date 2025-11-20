import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PROFILE_FEATURE_KEY, ProfileState } from './profile.reducer';

export const selectProfileState = createFeatureSelector<ProfileState>(PROFILE_FEATURE_KEY);

export const selectProfile = createSelector(selectProfileState, (state) => state.profile);
