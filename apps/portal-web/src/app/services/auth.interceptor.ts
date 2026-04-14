import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se o token existir, clonamos a requisição e injetamos o cabeçalho de Autorização
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Manda a requisição modificada para frente
    return next(clonedRequest);
  }

  // Se não tem token (ex: na própria tela de login), manda a requisição original
  return next(req);
};
