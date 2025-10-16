import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor que añade el token JWT a cada request.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
