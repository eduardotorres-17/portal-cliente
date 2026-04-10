import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  projetosDoBanco: any[] = [];
  usuarioLogado: string | null = '';

  // Injetamos a API e a Autenticação
  constructor(private apiService: ApiService, public authService: AuthService) {}

  ngOnInit() {
    // Pega o e-mail de quem logou (que salvamos no localStorage)
    this.usuarioLogado = localStorage.getItem('userEmail');
    this.carregarProjetos();
  }

  carregarProjetos() {
    this.apiService.getProjects().subscribe({
      next: (dados) => {
        this.projetosDoBanco = dados;
        console.log('Projetos carregados:', dados);
      },
      error: (erro) => { console.error('Erro ao buscar projetos:', erro); }
    });
  }
}
