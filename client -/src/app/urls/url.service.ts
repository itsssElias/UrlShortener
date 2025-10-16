import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UrlService {
  private http = inject(HttpClient);

  list(params: { q?: string; page?: number; limit?: number }) {
    const httpParams = new HttpParams({ fromObject: { ...params } as any });
    return this.http.get<any>('/api/urls', { params: httpParams });
  }

  create(body: { longUrl: string; customCode?: string; expiresAt?: string }) {
    return this.http.post<any>('/api/urls', body);
  }

  get(id: string) {
    return this.http.get<any>(`/api/urls/${id}`);
  }

  update(id: string, body: any) {
    return this.http.put<any>(`/api/urls/${id}`, body);
  }

  remove(id: string) {
    return this.http.delete<void>(`/api/urls/${id}`);
  }
}
