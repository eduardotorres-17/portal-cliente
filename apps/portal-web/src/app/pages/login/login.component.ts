import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service'; // 👈 Importa aqui

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  usuariosDoBanco: any[] = [];

  // 👇 Injeta o AuthService aqui
  constructor(
    private apiService: ApiService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.testarConexao();
  }

  testarConexao() {
    this.apiService.getUsers().subscribe({
      next: (dados) => {
        this.usuariosDoBanco = dados;
      },
      error: (erro) => {
        console.error(erro);
      },
    });
  }
}
