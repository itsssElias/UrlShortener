import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  template: `
  <h2>Registro</h2>
  <form (ngSubmit)="submit()" style="display:flex;flex-direction:column;gap:8px;max-width:360px">
    <input [(ngModel)]="name" name="name" placeholder="Nombre">
    <input [(ngModel)]="email" name="email" placeholder="Email" required>
    <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required>
    <button type="submit">Crear cuenta</button>
  </form>
  <p>¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  name = ''; 
  email = ''; 
  password = '';

  submit() {
    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        alert('✅ Registro exitoso, redirigiendo al login...');
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.error('❌ Error en registro:', err);
        alert(err.error.message || 'Error al registrarse');
      }
    });
  }
}
