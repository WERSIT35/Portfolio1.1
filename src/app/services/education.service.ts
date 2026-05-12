import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Education } from '../interfaces/education';
import { Skills } from '../interfaces/skills';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  private readonly education$ = this.http
    .get<Education[]>(`${this.apiBase}/content/education`)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  private readonly skills$ = this.http
    .get<Skills>(`${this.apiBase}/content/skills`)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  getEducation(): Observable<Education[]> {
    return this.education$;
  }

  getEduId(id: number): Observable<Education | undefined> {
    return this.education$.pipe(map((list) => list.find((e) => e.id === id)));
  }

  /** Returns the singleton Skills wrapped in an array for backwards compatibility with existing consumers that index `[0]`. */
  getSkills(): Observable<Skills[]> {
    return this.skills$.pipe(map((s) => [s]));
  }
}
