import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, shareReplay } from 'rxjs';
import { Education } from '../interfaces/education';
import { Skills } from '../interfaces/skills';
import { environment } from '../../environments/environment';
import { EDUCATION_ITEMS, SKILLS } from '../data/portfolio-content';

/**
 * Source is decided by `environment.useApi` (see ExperienceService for details).
 */
@Injectable({
  providedIn: 'root',
})
export class EducationService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  private readonly education$: Observable<Education[]> = environment.useApi
    ? this.http
        .get<Education[]>(`${this.apiBase}/content/education`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }))
    : of(EDUCATION_ITEMS);

  private readonly skills$: Observable<Skills> = environment.useApi
    ? this.http
        .get<Skills>(`${this.apiBase}/content/skills`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }))
    : of(SKILLS);

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
