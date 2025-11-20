import { inject, Injectable } from '@angular/core';
import { ProfileInterface } from '../interfaces/profile.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { profileApi } from '../api/profile.api';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http: HttpClient = inject(HttpClient);

  public getProfile(): Observable<ProfileInterface> {
    return this.http.get<ProfileInterface>(profileApi.getProfile);
  }
}
