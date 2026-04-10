import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  milestones: any[] = [];
  projectId: string = '';
  linkDeRetorno: string = '/login';

  // Variáveis para controlar o Chat
  etapaAtivaId: string | null = null;
  comentariosDaEtapa: any[] = [];
  novaMensagem: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];
    this.carregarMilestones();

    // Define o botão de voltar baseado em quem está logado
    const role = localStorage.getItem('userRole');
    this.linkDeRetorno = role === 'ADMIN' ? '/admin' : '/portal';
  }

  carregarMilestones() {
    this.apiService.getMilestonesByProject(this.projectId).subscribe({
      next: (data: any[]) => { this.milestones = data; },
      error: (err) => console.error('Erro ao buscar as etapas:', err)
    });
  }

  abrirChat(milestoneId: string) {
    // Se clicar na mesma etapa que já está aberta, ele fecha
    if (this.etapaAtivaId === milestoneId) {
      this.etapaAtivaId = null;
      return;
    }

    this.etapaAtivaId = milestoneId;
    this.carregarComentarios(milestoneId);
  }

  carregarComentarios(milestoneId: string) {
    this.apiService.getCommentsByMilestone(milestoneId).subscribe({
      next: (data) => { this.comentariosDaEtapa = data; },
      error: (err) => console.error('Erro ao carregar chat:', err)
    });
  }

  enviarMensagem() {
    if (!this.novaMensagem.trim() || !this.etapaAtivaId) return;

    const authorEmail = localStorage.getItem('userEmail');

    this.apiService.getUsers().subscribe(users => {
      const user = users.find((u: any) => u.email === authorEmail);
      if (user) {
        this.apiService.createComment(this.novaMensagem, this.etapaAtivaId!, user.id).subscribe({
          next: () => {
            this.novaMensagem = ''; // Limpa o input
            this.carregarComentarios(this.etapaAtivaId!); // Recarrega o chat
          },
          error: (err) => console.error('Erro ao enviar:', err)
        });
      }
    });
  }
}
