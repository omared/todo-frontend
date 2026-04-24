import { Component } from '@angular/core';
import { TaskListComponent } from './components/task-list/task-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListComponent],
  templateUrl: './app.html'
})
export class App {}
