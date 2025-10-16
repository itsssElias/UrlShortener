import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../url.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-url-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './url-detail.component.html'
})
export class UrlDetailComponent {
  private api = inject(UrlService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  url = signal<any>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.get(id).subscribe(u => this.url.set(u));
  }

  shortFull(code: string) {
    return `${location.origin.replace(':4200', ':4000')}/${code}`;
  }

  save() {
    const u = this.url();
    this.api.update(u._id, { longUrl: u.longUrl, isActive: u.isActive, expiresAt: u.expiresAt })
      .subscribe(x => this.url.set(x));
  }

  remove() {
    const id = this.url()?._id;
    this.api.remove(id).subscribe(() => this.router.navigateByUrl('/urls'));
  }
}
