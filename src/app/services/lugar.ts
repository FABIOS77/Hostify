import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Lugar } from '../models/lugar';

@Injectable({
  providedIn: 'root'
})
export class LugarService {
  private _baseUrl = 'https://airbnbmob2.site/api';
  public fileBaseUrl = 'https://airbnbmob2.site';
  private resultadosBusqueda = new BehaviorSubject<Lugar[]>([]);
  public resultadosBusqueda$ = this.resultadosBusqueda.asObservable();
  private ultimosParametrosBusqueda = new BehaviorSubject<any>(null);
  public ultimosParametrosBusqueda$ = this.ultimosParametrosBusqueda.asObservable();

  constructor(private http: HttpClient) { }

  searchLugares(params: any): Observable<Lugar[]> {
    this.ultimosParametrosBusqueda.next(params);
    return this.http.post<Lugar[]>(`${this._baseUrl}/lugares/search`, params).pipe(
      tap(resultados => {
        console.log('API Resultados simple:', resultados);
        this.resultadosBusqueda.next(resultados);
      })
    );
  }

  advancedSearchLugares(params: any): Observable<Lugar[]> {
    this.ultimosParametrosBusqueda.next(params);
    return this.http.post<Lugar[]>(`${this._baseUrl}/lugares/advancedsearch`, params).pipe(
      tap(resultados => {
        console.log('API Resultados avanzada', resultados);
        this.resultadosBusqueda.next(resultados);
      })
    );
  }

  getLugarById(id: number): Observable<Lugar> {
    return this.http.get<Lugar>(`${this._baseUrl}/lugares/${id}`);
  }
}