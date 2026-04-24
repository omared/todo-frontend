import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  isLoading: boolean = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando tareas:', err);
        this.isLoading = false;
      }
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;
    this.taskService.createTask(this.newTaskTitle.trim()).subscribe({
      next: (task: Task) => {
        this.tasks.unshift(task);
        this.newTaskTitle = '';
      },
      error: (err: any) => console.error('Error creando tarea:', err)
    });
  }

  toggleTask(task: Task): void {
    this.taskService.updateTask(task._id!, !task.completed).subscribe({
      next: (updated: Task) => {
        const index = this.tasks.findIndex(t => t._id === updated._id);
        if (index !== -1) this.tasks[index] = updated;
      },
      error: (err: any) => console.error('Error actualizando tarea:', err)
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t._id !== id);
      },
      error: (err: any) => console.error('Error eliminando tarea:', err)
    });
  }

  get pendingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }
}
