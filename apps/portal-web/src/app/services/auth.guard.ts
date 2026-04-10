import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verifica se tem crachá (Autenticação)
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Verifica a permissão (Autorização)
  const expectedRole = route.data['expectedRole']; // Lê a etiqueta da rota que colocamos
  const userRole = localStorage.getItem('userRole'); // Lê o cargo do cara que logou

  // Se a rota exige um cargo e o usuário tem um cargo diferente, bloqueia!
  if (expectedRole && userRole !== expectedRole) {
    console.error(`🚨 Acesso Negado! Rota exige ${expectedRole}, mas usuário é ${userRole}`);

    // Opcional: Se ele for Admin e tentar acessar portal de cliente, manda de volta pro admin.
    // E vice-versa.
    if (userRole === 'ADMIN') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/portal']);
    }
    return false; // Chuta da porta
  }

  // Se passou pelas duas barreiras, pode entrar!
  return true;
};
