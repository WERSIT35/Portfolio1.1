import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminUser, AdminRole } from '../interfaces/admin';
import { Experience } from '../interfaces/experience';
import { Projects } from '../interfaces/projects';
import { Education } from '../interfaces/education';
import { Certifications } from '../interfaces/certifications';
import { Skills } from '../interfaces/skills';
import { Contact } from '../interfaces/contact';
import { environment } from '../../environments/environment';

export type SectionKey =
  | 'hero'
  | 'ctas'
  | 'skills'
  | 'education'
  | 'experience'
  | 'certificates'
  | 'projects'
  | 'contact';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminContentService {
  private readonly apiBase = environment.apiBase;

  constructor(private http: HttpClient) {}

  getSection<T = unknown>(section: SectionKey): Observable<T> {
    return this.http.get<T>(`${this.apiBase}/content/${section}`);
  }

  updateSection<T = unknown>(section: SectionKey, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.apiBase}/admin/content/${section}`, body);
  }

  getExperience(): Observable<Experience[]> { return this.getSection<Experience[]>('experience'); }
  saveExperience(items: Experience[]): Observable<Experience[]> { return this.updateSection<Experience[]>('experience', items); }

  getProjects(): Observable<Projects[]> { return this.getSection<Projects[]>('projects'); }
  saveProjects(items: Projects[]): Observable<Projects[]> { return this.updateSection<Projects[]>('projects', items); }

  getEducation(): Observable<Education[]> { return this.getSection<Education[]>('education'); }
  saveEducation(items: Education[]): Observable<Education[]> { return this.updateSection<Education[]>('education', items); }

  getCertificates(): Observable<Certifications[]> { return this.getSection<Certifications[]>('certificates'); }
  saveCertificates(items: Certifications[]): Observable<Certifications[]> { return this.updateSection<Certifications[]>('certificates', items); }

  getSkills(): Observable<Skills> { return this.getSection<Skills>('skills'); }
  saveSkills(data: Skills): Observable<Skills> { return this.updateSection<Skills>('skills', data); }

  getContact(): Observable<Contact> { return this.getSection<Contact>('contact'); }
  saveContact(data: Contact): Observable<Contact> { return this.updateSection<Contact>('contact', data); }

  uploadImage(file: File): Observable<UploadResponse> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<UploadResponse>(`${this.apiBase}/admin/uploads`, form);
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiBase}/admin/users`);
  }

  createUser(payload: {
    fullName: string;
    email: string;
    password: string;
    role: AdminRole;
  }): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${this.apiBase}/admin/users`, payload);
  }

  updateUser(id: string, payload: Partial<{
    fullName: string;
    role: AdminRole;
    isActive: boolean;
    password: string;
  }>): Observable<AdminUser> {
    return this.http.patch<AdminUser>(`${this.apiBase}/admin/users/${id}`, payload);
  }

  deleteUser(id: string): Observable<{ ok: true }> {
    return this.http.delete<{ ok: true }>(`${this.apiBase}/admin/users/${id}`);
  }
}
