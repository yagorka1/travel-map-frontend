import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { profileApi } from '../api/profile.api';
import { ChangePasswordDto, ProfileInterface, UpdateProfileDto } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http: HttpClient = inject(HttpClient);

  public getProfile(): Observable<ProfileInterface> {
    return this.http.get<ProfileInterface>(profileApi.getProfile);
  }

  public updateProfile(profile: UpdateProfileDto): Observable<ProfileInterface> {
    const formData = new FormData();

    if (profile.name) formData.append('name', profile.name);
    if (profile.password) formData.append('password', profile.password);
    if (profile.language) formData.append('language', profile.language);
    if (profile.avatarUrl) formData.append('avatar', profile.avatarUrl);

    return this.http.patch<ProfileInterface>(profileApi.updateProfile, formData);
  }

  public changePassword(changePasswordDto: ChangePasswordDto): Observable<void> {
    return this.http.post<void>(profileApi.changePassword, changePasswordDto);
  }
}
