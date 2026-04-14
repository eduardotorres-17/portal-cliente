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

  etapaAtivaId: string | null = null;
  comentariosDaEtapa: any[] = [];
  novaMensagem: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];
    this.carregarMilestones();

    const role = localStorage.getItem('userRole');
    this.linkDeRetorno = role === 'ADMIN' ? '/admin' : '/portal';
  }

  carregarMilestones() {
    this.apiService.getMilestonesByProject(this.projectId).subscribe({
      next: (dados: any) => {
        let arraySeguro = [];
        if (Array.isArray(dados)) arraySeguro = dados;
        else if (dados && dados.data && Array.isArray(dados.data))
          arraySeguro = dados.data;
        else if (dados && typeof dados === 'object') arraySeguro = [dados];

        this.milestones = arraySeguro;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar as etapas:', err);
        this.cdr.detectChanges();
      },
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
        let arraySeguro = [];
        if (Array.isArray(dados)) arraySeguro = dados;
        else if (dados && dados.data && Array.isArray(dados.data))
          arraySeguro = dados.data;
        else if (dados && typeof dados === 'object') arraySeguro = [dados];

        this.comentariosDaEtapa = arraySeguro;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar chat:', err);
        this.cdr.detectChanges();
      },
    });
  }

  enviarMensagem() {
    if (!this.novaMensagem.trim() || !this.etapaAtivaId) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const authorId = payload.sub;

    this.apiService
      .createComment(this.novaMensagem, this.etapaAtivaId, authorId)
      .subscribe({
        next: () => {
          this.novaMensagem = '';
          this.carregarComentarios(this.etapaAtivaId!);
        },
        error: (err) => {
          console.error('Erro ao enviar:', err);
        },
      });
  }
}
