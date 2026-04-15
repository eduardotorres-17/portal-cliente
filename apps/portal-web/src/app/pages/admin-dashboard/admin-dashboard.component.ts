import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../components/toast.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToastComponent], 
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  projetos: any[] = [];
  usuarios: any[] = [];
  isLoading = true;
  exibirModal = false;

  novoProjeto = { title: '', description: '', clientId: '' };

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService, // 👈 INJETE O SERVIÇO AQUI
  ) {}

  ngOnInit() {
    this.carregarProjetos();
    this.carregarUsuarios();
  }

  carregarProjetos() {
    this.isLoading = true;
    this.apiService.getProjects().subscribe({
      next: (dados) => {
        this.projetos = Array.isArray(dados) ? dados : [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.show('Erro ao carregar projetos da API.', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  carregarUsuarios() {
    this.apiService.getUsers().subscribe({
      next: (dados) => {
        this.usuarios = dados.filter((u) => u.role === 'CLIENT');
        this.cdr.detectChanges();
      },
    });
  }

  salvarProjeto() {
    if (!this.novoProjeto.title || !this.novoProjeto.clientId) {
      this.toast.show('Preencha os campos obrigatórios.', 'error');
      return;
    }

    this.apiService.createProject(this.novoProjeto).subscribe({
      next: () => {
        this.exibirModal = false;
        this.novoProjeto = { title: '', description: '', clientId: '' };
        this.toast.show('Projeto criado com sucesso!', 'success'); // 👈 TOAST EM AÇÃO!
        this.carregarProjetos();
      },
    });
  }

  excluirProjeto(id: string) {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    this.apiService.deleteProject(id).subscribe({
      next: () => {
        this.toast.show('Projeto excluído.', 'info');
        this.carregarProjetos();
      },
    });
  }
}
