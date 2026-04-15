import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  usuarios: any[] = [];
  exibirModal = false;

  novoUsuario = {
    name: '',
    email: '',
    password: '',
    role: 'CLIENT'
  };

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.apiService.getUsers().subscribe({
      next: (dados) => {
        this.usuarios = Array.isArray(dados) ? dados : [];
        this.cdr.detectChanges();
      }
    });
  }

  salvarUsuario() {
    if (!this.novoUsuario.name || !this.novoUsuario.email || !this.novoUsuario.password) return;

    this.apiService.createUser(this.novoUsuario).subscribe({
      next: () => {
        this.exibirModal = false;
        this.novoUsuario = { name: '', email: '', password: '', role: 'CLIENT' };
        this.carregarUsuarios();
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao criar usuário. Verifique se o e-mail já existe.');
      }
    });
  }

  excluirUsuario(id: string) {
    if (!confirm('Tem certeza que deseja excluir este usuário? Todos os projetos dele poderão ser afetados.')) return;

    this.apiService.deleteUser(id).subscribe({
      next: () => this.carregarUsuarios(),
      error: (err) => alert('Erro ao excluir usuário.')
    });
  }
}