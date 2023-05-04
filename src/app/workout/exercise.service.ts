import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, map, switchMap, of, shareReplay, tap } from 'rxjs';
import { ExerciseSearchResponse } from '../types/common';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiKey = environment.apiNinjas.key;
  private url = 'https://api.api-ninjas.com/v1/exercises';
  private headers = new HttpHeaders().set('X-Api-Key', this.apiKey);
  private loadingSubject = new Subject<boolean>();
  get loading$(): Observable<boolean> {
    return this.loadingSubject;
  }

  constructor(private http: HttpClient) { 
  }

  search(name: string = '', type: string = '', muscle: string = ''): Observable<ExerciseSearchResponse[]> {
    return of({ name, type, muscle }).pipe(
      tap(() => this.loadingSubject.next(true)),
      map(query => {
        let params = new HttpParams();
        if (!!query.name) {
          params = params.set('name', query.name);
        }

        if (!!query.type) {
          params = params.set('type', query.type);
        }

        if (!!query.muscle) {
          params = params.set('muscle', query.muscle);
        }

        return params;
      }),
      switchMap(params => {
        if (params.keys().length === 0) {
          return of([]);
        }

        return this.http.get<ExerciseSearchResponse[]>(this.url, { headers: this.headers, params: params }) 
      }),
      tap(() => this.loadingSubject.next(false)),
      shareReplay()
    )
  }
}
