import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { TodoDto } from '../model/todo.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TodoService {
  constructor(private backend: BackendService) {}

  addTodo(todo: TodoDto) {
    console.log('compl?', todo.completed);
    return this.backend.post('/todo', todo);
  }

  delete(id: string) {
    return this.backend.delete('/todo/' + id);
  }

  updateTodoById(id, todo) {
    return this.backend.put('/todo', todo);
  }

  findAll(): Observable<TodoDto[]> {
    return this.backend.get('/todo/find').pipe();
  }

  getById(id: string) {
    return this.backend.get('/todo/' + id);
  }

  toggleTodoComplete(todo: TodoDto) {
    const updatedTodo = todo;
    updatedTodo.completed = !updatedTodo.completed;
    return this.updateTodoById(updatedTodo.id, updatedTodo);
  }
}
