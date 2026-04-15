import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/projects/${id}`);
  }

  createProject(project: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${id}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  getMilestonesByProject(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/milestones/project/${projectId}`,
    );
  }

  createMilestone(milestone: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/milestones`, milestone);
  }

  deleteMilestone(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/milestones/${id}`);
  }

  getCommentsByMilestone(milestoneId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/comments/milestone/${milestoneId}`,
    );
  }

  createComment(
    content: string,
    milestoneId: string,
    authorId: string,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, {
      content,
      milestone_id: milestoneId,
      author_id: authorId,
    });
  }
}
