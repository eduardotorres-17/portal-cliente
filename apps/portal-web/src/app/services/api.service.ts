import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // 👇 Novo método para buscar os projetos!
  getProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects`);
  }

  // Adicione este método abaixo do getProjects()
  getMilestonesByProject(projectId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/milestones/project/${projectId}`);
  }

  // Busca toda a conversa de uma etapa específica
  getCommentsByMilestone(milestoneId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments/milestone/${milestoneId}`);
  }

  // Envia uma nova mensagem
  createComment(content: string, milestoneId: string, authorId: string): Observable<any> {
    const payload = {
      content: content,
      milestone_id: milestoneId,
      author_id: authorId
    };
    return this.http.post(`${this.apiUrl}/comments`, payload);
  }
}
