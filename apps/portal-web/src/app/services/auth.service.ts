import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((resposta: any) => {
          localStorage.setItem('access_token', resposta.access_token);
          localStorage.setItem('userEmail', resposta.user.email);
          localStorage.setItem('userRole', resposta.user.role);
          localStorage.setItem('userName', resposta.user.name);

          const role = resposta.user.role;
          this.router.navigate([role === 'ADMIN' ? '/admin' : '/portal']);
        }),
      );
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      email,
      newPassword,
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
