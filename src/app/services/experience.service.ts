import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Experience } from '../interfaces/experience';
import { Certifications } from '../interfaces/certifications';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  private readonly experiences$ = this.http
    .get<Experience[]>(`${this.apiBase}/content/experience`)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  private readonly certifications$ = this.http
    .get<Certifications[]>(`${this.apiBase}/content/certificates`)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  getCertificate(): Observable<Certifications[]> {
    return this.certifications$;
  }

  getCertifyId(id: number): Observable<Certifications | undefined> {
    return this.certifications$.pipe(map((list) => list.find((c) => c.id === id)));
  }

  getExperienceList(): Observable<Experience[]> {
    return this.experiences$;
  }

  getExpId(id: number): Observable<Experience | undefined> {
    return this.experiences$.pipe(map((list) => list.find((e) => e.id === id)));
  }
}
