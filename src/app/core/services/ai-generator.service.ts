import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of, retry } from 'rxjs';
import { GeneratedOutput, GenerationType } from '../models/angular.models';
import { synthesizeAngularArtifact } from './synthesizer';

export interface GenerateRequest {
  prompt: string;
  type: GenerationType;
  refinement?: string;
  previousOutput?: GeneratedOutput;
}

/**
 * Talks to a `/api/generate` backend if one is deployed. This app ships with
 * no backend, so the request 404s and we transparently fall back to the
 * local synthesis engine — the RxJS pipeline (retry -> catchError -> local
 * fallback) is real and is what a production deployment with a live AI
 * backend would use unchanged.
 */
@Injectable({ providedIn: 'root' })
export class AiGeneratorService {
  private readonly http = inject(HttpClient);

  generate(request: GenerateRequest): Observable<GeneratedOutput> {
    return this.http.post<GeneratedOutput>('/api/generate', request).pipe(
      retry(1),
      catchError(() =>
        of(
          synthesizeAngularArtifact(
            request.prompt,
            request.type,
            request.refinement,
            request.previousOutput
          )
        ).pipe(delay(600))
      )
    );
  }
}
