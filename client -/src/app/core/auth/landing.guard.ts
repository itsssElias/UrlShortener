import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const landingGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // simple: usa localStorage
  router.navigateByUrl(token ? '/urls' : '/login');
  return false; // no renderiza esta ruta, solo redirige
};
