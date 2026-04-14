import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Importamos o ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  projetos: any[] = [];
  isLoading = true;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef, // 👈 Injetamos o "Gritador" aqui
  ) {}

  ngOnInit() {
    this.carregarProjetos();
  }

  carregarProjetos() {
    this.isLoading = true;
    this.apiService.getProjects().subscribe({
      next: (dados: any) => {
        let arraySeguro = [];
        if (Array.isArray(dados)) arraySeguro = dados;
        else if (dados && dados.data && Array.isArray(dados.data))
          arraySeguro = dados.data;
        else if (dados && typeof dados === 'object') arraySeguro = [dados];

        this.projetos = arraySeguro;
        this.isLoading = false;

        // 👇 O GRITO! "Angular, atualize o HTML imediatamente!"
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERRO HTTP:', err);
        this.isLoading = false;
        this.cdr.detectChanges(); // Atualiza a tela mesmo se der erro
      },
    });
  }
}
