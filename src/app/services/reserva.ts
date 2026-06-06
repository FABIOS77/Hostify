import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearReservaPayload, MiReserva } from '../models/reserva';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private _baseUrl = 'https://airbnbmob2.site/api';
  constructor(private http: HttpClient) { }
  
  crearReserva(payload: CrearReservaPayload): Observable<any> {
    return this.http.post<any>(`${this._baseUrl}/reservas`, payload);
  }
  getReservasByClienteId(clienteId: number): Observable<MiReserva[]> {
    return this.http.get<MiReserva[]>(`${this._baseUrl}/reservas/cliente/${clienteId}`);
  }
}