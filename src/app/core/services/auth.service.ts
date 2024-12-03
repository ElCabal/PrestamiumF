import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { BaseResponse } from '../interfaces/base-response.interface';
import { LoginRequest, RegisterRequest, AuthResponse, UserInfo } from '../interfaces/auth.interface';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  private refreshTokenTimeout?: any;

  login(request: LoginRequest): Observable<BaseResponse<AuthResponse>> {
    return this.http.post<BaseResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, request)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setUserData(response.data!);
            this.startRefreshTokenTimer();
          }
        })
      );
  }

  register(request: RegisterRequest): Observable<BaseResponse<AuthResponse>> {
    return this.http.post<BaseResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, request)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setUserData(response.data!);
            this.startRefreshTokenTimer();
          }
        })
      );
  }

  refreshToken(): Observable<BaseResponse<AuthResponse>> {
    const user = this.getUserFromStorage();
    if (!user) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<BaseResponse<AuthResponse>>(`${this.apiUrl}/auth/refresh-token`, {
      refreshToken: user.refreshToken
    }).pipe(
      tap(response => {
        if (response.success) {
          this.setUserData(response.data!);
          this.startRefreshTokenTimer();
        }
      })
    );
  }

  private startRefreshTokenTimer() {
    const user = this.getUserFromStorage();
    if (!user) return;

    // Refresh the token 1 minute before it expires
    const expires = new Date(user.refreshTokenExpiration).getTime();
    const timeout = expires - Date.now() - (60 * 1000);
    
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  logout(): void {
    // Attempt to revoke the refresh token on the server
    const user = this.getUserFromStorage();
    if (user) {
      this.http.post(`${this.apiUrl}/auth/revoke-token`, {
        refreshToken: user.refreshToken
      }).subscribe();
    }

    this.stopRefreshTokenTimer();
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private setUserData(user: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  private getUserFromStorage(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return this.userSubject.value?.token ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): UserInfo | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}