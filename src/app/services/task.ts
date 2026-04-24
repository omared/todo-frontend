import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
 // private apiUrl = 'http://localhost:3000/api/tasks';
 private apiUrl = 'https://todo-backend-uv6t.onrender.com/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(title: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { title });
  }

  updateTask(id: string, completed: boolean): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, { completed });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
