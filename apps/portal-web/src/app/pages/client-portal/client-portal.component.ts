import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [CommonModule, RouterModule
  ],
  templateUrl: './client-portal.component.html',
  styleUrls: ['./client-portal.component.scss']
})
export class ClientPortalComponent implements OnInit {
  meusProjetos: any[] = [];
  usuarioLogado: string | null = '';

  constructor(private apiService: ApiService, public authService: AuthService) {}

  ngOnInit() {
    this.usuarioLogado = localStorage.getItem('userEmail');
    this.carregarMeusProjetos();
  }

  carregarMeusProjetos() {
    this.apiService.getProjects().subscribe({
      next: (dados: any[]) => {
        // Mágica do Front-end: Filtramos os projetos para mostrar SÓ os deste cliente
        this.meusProjetos = dados.filter(projeto =>
          projeto.client && projeto.client.email === this.usuarioLogado
        );
      },
      error: (erro) => console.error('Erro ao buscar projetos do cliente:', erro)
    });
  }
}
