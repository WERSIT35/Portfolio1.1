import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminUser } from '../interfaces/admin';

@Injectable({
  providedIn: 'root',
})
export class AdminContentService {
  private readonly apiBase = 'http://localhost:4300/api';

  constructor(private http: HttpClient) {}

  getSection(section: string): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiBase}/content/${section}`);
  }

  updateSection(section: string, body: unknown): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiBase}/admin/content/${section}`, body);
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiBase}/admin/users`);
  }

  createUser(payload: {
    fullName: string;
    email: string;
    password: string;
    role: 'super_admin' | 'editor' | 'viewer';
  }): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${this.apiBase}/admin/users`, payload);
  }
}
