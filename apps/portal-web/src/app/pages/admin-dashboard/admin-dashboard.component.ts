import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../components/toast.component';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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

  kpiTotal = 0;
  kpiAndamento = 0;
  kpiConcluidos = 0;
  graficoInstancia: any = null;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
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

        this.calcularMetricas();

        this.isLoading = false;
        this.cdr.detectChanges();

        setTimeout(() => this.desenharGrafico(), 100);
      },
      error: () => {
        this.toast.show('Erro ao carregar projetos.', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  calcularMetricas() {
    this.kpiTotal = this.projetos.length;
    this.kpiConcluidos = this.projetos.filter(
      (p) => p.status === 'COMPLETED',
    ).length;
    this.kpiAndamento = this.kpiTotal - this.kpiConcluidos;
  }

  desenharGrafico() {
    const canvas = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.graficoInstancia) {
      this.graficoInstancia.destroy();
    }

    this.graficoInstancia = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Em Andamento', 'Concluídos'],
        datasets: [
          {
            data: [this.kpiAndamento, this.kpiConcluidos],
            backgroundColor: ['#bef264', '#c026d3'],
            borderWidth: 4,
            borderColor: '#09090b',
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#a1a1aa',
              font: { family: 'monospace', weight: 'bold' },
            },
          },
        },
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
        this.toast.show('Projeto criado com sucesso!', 'success');
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
