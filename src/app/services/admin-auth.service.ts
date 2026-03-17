import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AdminUser, LoginResponse } from '../interfaces/admin';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private readonly apiBase = 'http://localhost:4300/api';
  private readonly tokenKey = 'admin_token';
  private readonly userKey = 'admin_user';
  private readonly userSubject = new BehaviorSubject<AdminUser | null>(this.loadUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiBase}/auth/login`, { email, password })
      .pipe(tap((res) => this.setSession(res.token, res.user)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): AdminUser | null {
    return this.userSubject.value;
  }

  private setSession(token: string, user: AdminUser): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  private loadUser(): AdminUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  }
}
