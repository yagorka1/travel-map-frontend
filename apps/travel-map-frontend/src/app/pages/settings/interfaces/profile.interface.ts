export interface ProfileInterface {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  language: string;
}

export interface UpdateProfileDto {
  name?: string;
  password?: string;
  avatarUrl?: File;
  language?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
