import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _baseUrl = 'https://airbnbmob2.site/api';
  private _userIdKey = 'CLIENTE_USER_ID';
  private _storage: Storage | null = null;

  authState = new BehaviorSubject<boolean | null>(null);

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.initStorage();
  }
  async initStorage() {
    this._storage = await this.storage.create();
    this.checkLoginStatus();
  }

  async checkLoginStatus() {
    const userId = await this._storage?.get(this._userIdKey);
    this.authState.next(!!userId);
  }

  login(email: string, password: string): Observable<Cliente> {
    return this.http.post<Cliente>(`${this._baseUrl}/cliente/login`, { email, password }).pipe(
      tap(async (respuesta) => {
        if (respuesta && respuesta.id) {
          await this._storage?.set(this._userIdKey, respuesta.id.toString());
          this.authState.next(true);
        } else {
          this.authState.next(false);
        }
      })
    );
  }

  registro(datosRegistro: any): Observable<any> {
    return this.http.post(`${this._baseUrl}/cliente/registro`, datosRegistro);
  }
  async logout() {
    await this._storage?.remove(this._userIdKey);
    this.authState.next(false);
  }
  async getUserId(): Promise<string | null> {
    return await this._storage?.get(this._userIdKey);
  }

  
  isLoggedIn(): boolean {
    return this.authState.value === true;
  }
}