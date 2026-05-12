import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, shareReplay } from 'rxjs';
import { Projects } from '../interfaces/projects';
import { environment } from '../../environments/environment';
import { PROJECTS } from '../data/portfolio-content';

/**
 * Source is decided by `environment.useApi` (see ExperienceService for details).
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  private readonly projects$: Observable<Projects[]> = environment.useApi
    ? this.http
        .get<Projects[]>(`${this.apiBase}/content/projects`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }))
    : of(PROJECTS);

  getProjects(): Observable<Projects[]> {
    return this.projects$;
  }

  getProjectById(id: number): Observable<Projects | undefined> {
    return this.projects$.pipe(map((list) => list[id]));
  }

  getFeatured(): Observable<Projects[]> {
    return this.projects$.pipe(map((list) => list.filter((p) => p.featured)));
  }

  getNonFeatured(): Observable<Projects[]> {
    return this.projects$.pipe(map((list) => list.filter((p) => !p.featured)));
  }
}
