import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { authApi } from '../api/auth.api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken$ = new BehaviorSubject<string | null>(null);
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  public get token(): string | null {
    return this.accessToken$.value;
  }

  public get userId(): string | null {
    if (this.token) {
      return (jwtDecode(this.token) as any).id;
    }

    return null;
  }

  public setToken(token: string) {
    this.accessToken$.next(token);
  }

  public login(dto: { email: string; password: string }): Observable<any> {
    return this.http.post(authApi.login, dto, { withCredentials: true }).pipe(
      tap((res: any) => {
        this.setToken(res.accessToken);
        this.router.navigate(['/']);
      }),
    );
  }

  public signUp(dto: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post(authApi.signUp, dto, { withCredentials: true }).pipe(
      tap((res: any) => {
        this.router.navigate(['/']);
      }),
    );
  }

  public refresh(): Observable<any> {
    return this.http
      .post(authApi.refresh, {}, { withCredentials: true })
      .pipe(tap((res: any) => this.setToken(res.accessToken)));
  }

  public logout(): void {
    this.accessToken$.next(null);
    this.http.post(authApi.logout, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.router.navigate(['/auth/sign-in']);
      },
      error: () => {
        this.router.navigate(['/auth/sign-in']);
      },
    });
  }
}
