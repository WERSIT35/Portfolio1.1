import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Projects } from '../interfaces/projects';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  private readonly projects$ = this.http
    .get<Projects[]>(`${this.apiBase}/content/projects`)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

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
