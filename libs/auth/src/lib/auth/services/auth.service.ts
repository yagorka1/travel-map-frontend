import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { authApi } from '@app/auth/lib/auth/libs/api/auth.api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken$ = new BehaviorSubject<string | null>(null);
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  public get token(): string | null {
    return this.accessToken$.value;
  }

  public setToken(token: string) {
    this.accessToken$.next(token);
  }

  public login(dto: { email: string; password: string }): Observable<any> {
    return this.http.post(authApi.login, dto, { withCredentials: true }).pipe(
      tap((res: any) =>  {
        this.setToken(res.accessToken);
        this.router.navigate(['/']);
      })
    );
  }

  public refresh(): Observable<any> {
    return this.http.post(authApi.refresh, {}, { withCredentials: true }).pipe(
      tap((res: any) => this.setToken(res.accessToken))
    );
  }

  public logout() {
    this.accessToken$.next(null);
    this.http.post(authApi.logout, {}, { withCredentials: true }).subscribe();
  }

  public test1(): Observable<any> {
    return this.http.get('/auth/protected');
  }
}
