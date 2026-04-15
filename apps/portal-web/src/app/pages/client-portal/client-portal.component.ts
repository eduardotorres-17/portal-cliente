import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-portal.component.html',
  styleUrls: ['./client-portal.component.scss'],
})
export class ClientPortalComponent implements OnInit {
  meusProjetos: any[] = [];
  usuarioLogado: string | null = '';
  nomeUsuario: string | null = '';
  isLoading = true;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.usuarioLogado = localStorage.getItem('userEmail');
    const nomeCompleto = localStorage.getItem('userName') || 'Cliente';
    this.nomeUsuario = nomeCompleto.split(' ')[0];
    this.carregarMeusProjetos();
  }

  carregarMeusProjetos() {
    this.isLoading = true;
    this.apiService.getProjects().subscribe({
      next: (dados: any) => {
        console.log('🔥 [FRONTEND DEBUG] DADOS BRUTOS RECEBIDOS:', dados);

        let arraySeguro = [];

        if (Array.isArray(dados)) {
          arraySeguro = dados;
        } else if (dados && dados.data && Array.isArray(dados.data)) {
          arraySeguro = dados.data;
        } else if (dados && typeof dados === 'object') {
          arraySeguro = [dados];
        }

        console.log(
          '🛡️ [FRONTEND DEBUG] ARRAY FINAL QUE VAI PRA TELA:',
          arraySeguro,
        );

        this.meusProjetos = arraySeguro;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('🚨 [FRONTEND DEBUG] ERRO HTTP:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
