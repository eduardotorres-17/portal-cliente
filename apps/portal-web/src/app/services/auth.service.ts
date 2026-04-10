import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  // Aqui nós salvamos quem é o usuário e qual o cargo dele (Crachá)
  login(email: string, role: string) {
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);

    // O grande redirecionamento do sistema!
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/portal']);
    }
  }

  // Joga o crachá fora
  logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  // Verifica se a pessoa tem o crachá
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userRole');
  }
}
