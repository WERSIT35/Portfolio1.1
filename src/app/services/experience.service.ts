import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, shareReplay } from 'rxjs';
import { Experience } from '../interfaces/experience';
import { Certifications } from '../interfaces/certifications';
import { environment } from '../../environments/environment';
import { EXPERIENCES, CERTIFICATIONS } from '../data/portfolio-content';

/**
 * Returns experience + certification content.
 *
 * Source is decided by `environment.useApi`:
 *   - `false` → static snapshot from src/app/data/portfolio-content.ts (default for prod today)
 *   - `true`  → live GET against ${apiBase}/content/{experience,certificates}
 *
 * Public API stays Observable-based so consumers don't care which side is serving them.
 */
@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  private readonly experiences$: Observable<Experience[]> = environment.useApi
    ? this.http
        .get<Experience[]>(`${this.apiBase}/content/experience`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }))
    : of(EXPERIENCES);

  private readonly certifications$: Observable<Certifications[]> = environment.useApi
    ? this.http
        .get<Certifications[]>(`${this.apiBase}/content/certificates`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }))
    : of(CERTIFICATIONS);

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
