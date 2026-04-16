import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  milestones: any[] = [];
  projectId: string = '';
  linkDeRetorno: string = '/login';
  isAdmin = false;
  exibirModalMilestone = false;

  totalPeso = 0;

  novaMilestone = { title: '', description: '', weight: 10, project_id: '' };
  etapaAtivaId: string | null = null;
  comentariosDaEtapa: any[] = [];
  novaMensagem: string = '';
  arquivoSelecionado: File | null = null; // 👈 VARIÁVEL NOVA

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];
    this.novaMilestone.project_id = this.projectId;
    this.isAdmin = localStorage.getItem('userRole') === 'ADMIN';
    this.linkDeRetorno = this.isAdmin ? '/admin' : '/portal';
    this.carregarMilestones();
  }

  carregarMilestones() {
    this.apiService.getMilestonesByProject(this.projectId).subscribe({
      next: (dados: any) => {
        this.milestones = Array.isArray(dados) ? dados : [];
        this.atualizarProgressoTotal();
        this.cdr.detectChanges();
      },
    });
  }

  atualizarProgressoTotal() {
    this.totalPeso = this.milestones.reduce(
      (soma, etapa) => soma + Number(etapa.weight),
      0,
    );
  }

  salvarMilestone() {
    if (this.totalPeso + Number(this.novaMilestone.weight) > 100) {
      alert(
        `Erro: A soma não pode ultrapassar 100%. Espaço disponível: ${100 - this.totalPeso}%`,
      );
      return;
    }
    this.apiService.createMilestone(this.novaMilestone).subscribe({
      next: () => {
        this.exibirModalMilestone = false;
        this.novaMilestone = {
          title: '',
          description: '',
          weight: 10,
          project_id: this.projectId,
        };
        this.carregarMilestones();
      },
    });
  }

  excluirMilestone(id: string, event: Event) {
    event.stopPropagation();
    if (!confirm('Excluir esta etapa?')) return;
    this.apiService.deleteMilestone(id).subscribe({
      next: () => this.carregarMilestones(),
    });
  }

  abrirChat(milestoneId: string) {
    if (this.etapaAtivaId === milestoneId) {
      this.etapaAtivaId = null;
      return;
    }
    this.etapaAtivaId = milestoneId;
    this.carregarComentarios(milestoneId);
  }

  carregarComentarios(milestoneId: string) {
    this.apiService.getCommentsByMilestone(milestoneId).subscribe({
      next: (dados: any) => {
        this.comentariosDaEtapa = Array.isArray(dados) ? dados : [];
        this.cdr.detectChanges();
      },
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.arquivoSelecionado = file;
    }
  }

  enviarMensagem() {
    if (!this.novaMensagem.trim() || !this.etapaAtivaId) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));

    this.apiService
      .createComment(
        this.novaMensagem,
        this.etapaAtivaId,
        payload.sub,
        this.arquivoSelecionado || undefined,
      )
      .subscribe({
        next: () => {
          this.novaMensagem = '';
          this.arquivoSelecionado = null;
          this.carregarComentarios(this.etapaAtivaId!);
        },
      });
  }
}
