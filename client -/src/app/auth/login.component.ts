import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // ✅ IMPORTANTE
import { AuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule], // ✅ agrega RouterModule aquí
  template: `
  <div style="max-width:400px;margin:60px auto;padding:30px;border:1px solid #ccc;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.1)">
    <h2 style="text-align:center;margin-bottom:20px;">Iniciar sesión</h2>

    <form (ngSubmit)="submit()" style="display:flex;flex-direction:column;gap:10px">
      <input [(ngModel)]="email" name="email" type="email" placeholder="Correo electrónico" required>
      <input [(ngModel)]="password" name="password" type="password" placeholder="Contraseña" required>
      <button type="submit" style="background:#6200ea;color:white;border:none;padding:8px;border-radius:4px;cursor:pointer">
        Ingresar
      </button>
    </form>

    <p style="text-align:center;margin-top:10px;">
      ¿Sin cuenta? 
      <a routerLink="/register" style="color:#6200ea;text-decoration:none;font-weight:500">Regístrate</a>
    </p>
  </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  submit() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigateByUrl('/urls'),
      error: (err) => alert(err?.error?.message || 'Error al iniciar sesión')
    });
  }
}
