import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'To-Do List App';
  currentYear: number = new Date().getFullYear();

  tasks: any[] = [];
  newTask = '';

  apiUrl = 'http://localhost:8000/';

  constructor(private http:HttpClient) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.http.get(this.apiUrl + 'get_tasks').subscribe((res) => {
      this.tasks = res as any[];
    });
  }

  addTask(): void {
    let body = new FormData();
    body.append('task', this.newTask);
    this.http.post(this.apiUrl + 'add_task', body).subscribe((res) => {
      alert(res);
      this.newTask = '';
      this.getTasks();
    });
  }

  deleteTask(id: any): void {
    let body = new FormData();
    body.append('id', id);
    this.http.post(this.apiUrl + 'delete_task', body).subscribe((res) => {
      alert(res);
      this.getTasks();
    });
  }

  swapWithPrevious(index: number): void {
    const current = this.tasks[index];
    const previous = this.tasks[index - 1];

    this.swapTasks(current.id, previous.id);
  }

  swapWithNext(index: number): void {
    const current = this.tasks[index];
    const next = this.tasks[index + 1];

    this.swapTasks(current.id, next.id);
  }

  swapTasks(id1: any, id2: any): void {
    const body = new FormData();
    body.append('id1', id1);
    body.append('id2', id2);

    this.http.post(this.apiUrl + 'swap_tasks', body).subscribe((res) => {
      alert(res);
      this.getTasks();
    });
  }
}