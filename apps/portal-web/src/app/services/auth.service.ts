import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  // Faz a chamada real para a API
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((resposta: any) => {
        // Se a API responder 200 OK, salvamos o Token e os dados com segurança
        localStorage.setItem('access_token', resposta.access_token);
        localStorage.setItem('userEmail', resposta.user.email);
        localStorage.setItem('userRole', resposta.user.role);

        // Redireciona com base no cargo
        const role = resposta.user.role;
        this.router.navigate([role === 'ADMIN' ? '/admin' : '/portal']);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  // Verifica se o Token existe
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Uma função útil para pegarmos o token depois
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
