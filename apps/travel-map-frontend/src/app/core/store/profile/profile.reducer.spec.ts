import { ProfileInterface } from '../../../pages/settings/interfaces/profile.interface';
import * as ProfileActions from './profile.actions';
import { initialState, profileReducer, ProfileState } from './profile.reducer';

describe('Profile Reducer', () => {
  describe('Initial State', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' };
      const state = profileReducer(undefined, action);

      expect(state).toEqual(initialState);
    });

    it('should have correct initial values', () => {
      expect(initialState.profile).toBeNull();
      expect(initialState.loading).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  describe('Load Profile Actions', () => {
    it('should set loading to true on loadProfile', () => {
      const action = ProfileActions.loadProfile();
      const state = profileReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.profile).toBeNull();
    });

    it('should set profile and loading to false on loadProfileSuccess', () => {
      const mockProfile: ProfileInterface = {
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: null,
        bio: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        language: 'en',
      };

      const action = ProfileActions.loadProfileSuccess({ profile: mockProfile });
      const loadingState: ProfileState = {
        ...initialState,
        loading: true,
      };
      const state = profileReducer(loadingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.profile).toEqual(mockProfile);
    });

    it('should set error and loading to false on loadProfileFailure', () => {
      const error = { message: 'Load failed' };
      const action = ProfileActions.loadProfileFailure({ error });
      const loadingState: ProfileState = {
        ...initialState,
        loading: true,
      };
      const state = profileReducer(loadingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
      expect(state.profile).toBeNull();
    });
  });

  describe('Update Profile Actions', () => {
    const existingProfile: ProfileInterface = {
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: null,
      bio: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      language: 'en',
    };

    it('should set loading to true on updateProfile', () => {
      const action = ProfileActions.updateProfile({
        profile: { name: 'Updated Name' },
      });
      const stateWithProfile: ProfileState = {
        ...initialState,
        profile: existingProfile,
      };
      const state = profileReducer(stateWithProfile, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.profile).toEqual(existingProfile); // Profile unchanged during update
    });

    it('should update profile and set loading to false on updateProfileSuccess', () => {
      const updatedProfile: ProfileInterface = {
        ...existingProfile,
        name: 'Updated Name',
      };

      const action = ProfileActions.updateProfileSuccess({ profile: updatedProfile });
      const loadingState: ProfileState = {
        ...initialState,
        profile: existingProfile,
        loading: true,
      };
      const state = profileReducer(loadingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.profile).toEqual(updatedProfile);
      expect(state.profile?.name).toBe('Updated Name');
    });

    it('should set error and loading to false on updateProfileFailure', () => {
      const error = { message: 'Update failed' };
      const action = ProfileActions.updateProfileFailure({ error });
      const loadingState: ProfileState = {
        ...initialState,
        profile: existingProfile,
        loading: true,
      };
      const state = profileReducer(loadingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
      expect(state.profile).toEqual(existingProfile); // Profile unchanged on error
    });
  });

  describe('State Transitions', () => {
    it('should handle multiple actions in sequence', () => {
      const mockProfile: ProfileInterface = {
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: null,
        bio: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        language: 'en',
      };

      // Start loading
      let state = profileReducer(initialState, ProfileActions.loadProfile());
      expect(state.loading).toBe(true);

      // Load success
      state = profileReducer(state, ProfileActions.loadProfileSuccess({ profile: mockProfile }));
      expect(state.loading).toBe(false);
      expect(state.profile).toEqual(mockProfile);

      // Start update
      state = profileReducer(state, ProfileActions.updateProfile({ profile: { name: 'New Name' } }));
      expect(state.loading).toBe(true);

      // Update success
      const updatedProfile = { ...mockProfile, name: 'New Name' };
      state = profileReducer(state, ProfileActions.updateProfileSuccess({ profile: updatedProfile }));
      expect(state.loading).toBe(false);
      expect(state.profile?.name).toBe('New Name');
    });

    it('should clear error on new load attempt', () => {
      const stateWithError: ProfileState = {
        ...initialState,
        error: { message: 'Previous error' },
      };

      const state = profileReducer(stateWithError, ProfileActions.loadProfile());
      expect(state.error).toBeNull();
    });

    it('should clear error on new update attempt', () => {
      const stateWithError: ProfileState = {
        ...initialState,
        error: { message: 'Previous error' },
      };

      const state = profileReducer(stateWithError, ProfileActions.updateProfile({ profile: { name: 'Test' } }));
      expect(state.error).toBeNull();
    });
  });
});
