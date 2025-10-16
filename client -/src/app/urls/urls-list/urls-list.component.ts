import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UrlService } from '../url.service';

@Component({
  standalone: true,
  selector: 'app-urls-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './urls-list.component.html'
})
export class UrlsListComponent {
  private api = inject(UrlService);

  q = '';
  page = 1;
  limit = 10;

  data = signal<{ items: any[]; total: number; page: number; pages: number }>({
    items: [], total: 0, page: 1, pages: 1
  });

  ngOnInit() { this.load(); }

  load() {
    this.api.list({ q: this.q, page: this.page, limit: this.limit })
      .subscribe(res => this.data.set(res));
  }

  next() { if (this.page < this.data().pages) { this.page++; this.load(); } }
  prev() { if (this.page > 1) { this.page--; this.load(); } }

  shortFull(code: string) {
    // el backend está en 4000; el proxy solo es para /api
    return `${location.origin.replace(':4200', ':4000')}/${code}`;
  }
}
