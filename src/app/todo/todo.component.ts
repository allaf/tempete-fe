import { Component, OnDestroy, OnInit } from '@angular/core';
import { Scavenger } from '@wishtack/rx-scavenger';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TodoDto } from '../model/todo.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'tempete-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  providers: [TodoService],
})
export class TodoComponent implements OnInit, OnDestroy {
  newTodo = new TodoDto();

  private scavenger = new Scavenger(this);

  todos = new BehaviorSubject<TodoDto[]>([]);

  constructor(private todoService: TodoService) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.todoService
      .findAll()
      .pipe(
        this.scavenger.collect(),
        tap((x) => {
          x.map((y) => (y.id = y._id));
        })
      )
      .subscribe((value) => {
        this.todos.next(value);
      });
  }

  addTodo() {
    console.log('addtodo');
    this.todoService
      .addTodo(this.newTodo)
      .pipe(this.scavenger.collect())
      .subscribe((x) => {
        this.getList();
        this.newTodo = new TodoDto();
      });
  }

  toggleTodoComplete(todo) {
    this.todoService
      .toggleTodoComplete(todo)
      .pipe(this.scavenger.collect())
      .subscribe((x) => {
        console.log("=>",x)
        this.getList();
      });
  }

  removeTodo(todo) {
    this.todoService.delete(todo.id).pipe(this.scavenger.collect()).subscribe();
    this.getList();
  }
}
