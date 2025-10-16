import { Component, inject } from '@angular/core';
import { UrlService } from '../url.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-url-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './url-create.component.html'
})
export class UrlCreateComponent {
  private api = inject(UrlService);
  private router = inject(Router);

  longUrl = '';
  customCode = '';
  expiresAt = ''; // datetime-local

  submit() {
    let longUrl = (this.longUrl || '').trim();

    // 👇 si el usuario olvida el esquema, lo agregamos
    if (longUrl && !/^https?:\/\//i.test(longUrl)) {
      longUrl = 'https://' + longUrl;
    }

    const payload: any = { longUrl };
    if (this.customCode) payload.customCode = this.customCode.trim();
    if (this.expiresAt)  payload.expiresAt  = this.expiresAt;

    this.api.create(payload).subscribe({
      next: (doc: any) => {
        alert('✅ URL creada');
        // Opción A: ir al detalle
        // this.router.navigate(['/urls', doc._id]);

        // Opción B: ir a la lista (si prefieres ver la tabla)
        this.router.navigate(['/urls']);
      },
      error: (err) => {
        const sv = err?.error?.errors;
        if (Array.isArray(sv) && sv.length) {
          alert('Errores:\n' + sv.map((e: any) => `• ${e.param}: ${e.msg}`).join('\n'));
        } else {
          alert(err?.error?.message || 'Error al crear URL');
        }
        console.error('❌ Error crear URL:', err);
      }
    });
  }
}
