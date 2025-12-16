import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  map,
  Observable,
  of,
  Subscription,
  take,
  tap,
  throwError,
} from 'rxjs';
import { authApi } from '../../api/auth.api';
import type { AuthResponse, JwtPayload, LoginDto, SignUpDto } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private accessToken$ = new BehaviorSubject<string | null>(null);
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  private isRefreshing = false;
  private refreshSubject$ = new BehaviorSubject<string | null>(null);
  private refreshTimeout: ReturnType<typeof setTimeout> | null = null;
  private refreshSubscription: Subscription | null = null;

  private readonly REFRESH_BUFFER_MS = 60 * 1000;

  public get token(): string | null {
    return this.accessToken$.value;
  }

  public get userId(): string | null {
    if (this.token) {
      return jwtDecode<JwtPayload>(this.token).id;
    }

    return null;
  }

  public setToken(token: string): void {
    this.accessToken$.next(token);
    this.scheduleProactiveRefresh(token);
  }

  public login(dto: LoginDto, returnUrl?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(authApi.login, dto, { withCredentials: true }).pipe(
      tap((res: AuthResponse) => {
        this.setToken(res.accessToken);
        this.router.navigate([returnUrl || '/']);
      }),
    );
  }

  public signUp(dto: SignUpDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(authApi.signUp, dto, { withCredentials: true }).pipe(
      tap(() => {
        this.router.navigate(['/']);
      }),
    );
  }

  public refresh(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(authApi.refresh, {}, { withCredentials: true })
      .pipe(tap((res: AuthResponse) => this.setToken(res.accessToken)));
  }

  public refreshWithQueue(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshSubject$.pipe(
        filter((token): token is string => token !== null),
        take(1),
      );
    }

    this.isRefreshing = true;
    this.refreshSubject$.next(null);

    return this.refresh().pipe(
      tap(() => {
        this.isRefreshing = false;
        this.refreshSubject$.next(this.token);
      }),
      catchError((err) => {
        this.isRefreshing = false;
        this.refreshSubject$.next(null);
        return throwError(() => err);
      }),
      map((res: AuthResponse) => res.accessToken),
    );
  }

  public logout(): Observable<void> {
    this.clearRefreshTimeout();
    this.accessToken$.next(null);

    return this.http.post<void>(authApi.logout, {}, { withCredentials: true }).pipe(
      finalize(() => {
        this.router.navigate(['/auth/sign-in']);
      }),
      catchError(() => of(undefined)),
    );
  }

  public ngOnDestroy(): void {
    this.clearRefreshTimeout();
  }

  private scheduleProactiveRefresh(token: string): void {
    this.clearRefreshTimeout();

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expiresAt = decoded.exp * 1000;
      const refreshAt = expiresAt - this.REFRESH_BUFFER_MS;
      const timeout = refreshAt - Date.now();

      if (timeout > 0) {
        this.refreshTimeout = setTimeout(() => {
          this.refreshSubscription = this.refresh().subscribe({
            error: () => {
              console.error('Failed to refresh token');
            },
          });
        }, timeout);
      }
    } catch {
      console.error('Invalid token format');
    }
  }

  private clearRefreshTimeout(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  public googleLogin(dto: { credential: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(authApi.googleLogin, dto, { withCredentials: true }).pipe(
      tap((res: AuthResponse) => {
        this.setToken(res.accessToken);
        this.router.navigate(['/']);
      }),
    );
  }
}
