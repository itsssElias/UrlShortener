import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginDto { email: string; password: string; }
export interface RegisterDto { name: string; email: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = '/api/auth';

  // ✅ agrega estos helpers
  getToken(): string | null { return localStorage.getItem('token'); }
  setToken(t: string) { localStorage.setItem('token', t); }
  clearToken() { localStorage.removeItem('token'); }
  isLoggedIn(): boolean { return !!this.getToken(); }

  login(dto: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.base}/login`, dto).pipe(
      tap(res => {
        if (res?.token) this.setToken(res.token);
      })
    );
  }

  register(dto: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.base}/register`, dto);
  }

  me(): Observable<any> {
    return this.http.get<any>(`${this.base}/me`);
  }
}
