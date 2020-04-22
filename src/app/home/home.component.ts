import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/auth.service';
import { first } from 'rxjs/operators';
import { User } from '../auth/user.model';
import { UserService } from '../auth/user.service.old';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: User;
  users = [];
  games = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllUsers();
    this.loadAllGames();
  }

  deleteUser(id: number) {
    this.userService.delete(id)
      .pipe(first())
      .subscribe(() => this.loadAllUsers());
  }

  private loadAllUsers() {
    this.userService.getAll()
      .pipe(first())
      .subscribe(users => this.users = users);
  }

  private loadAllGames() {
    this.userService.getAllGames()
      .pipe(first())
      .subscribe(games => this.games = games);
  }
}
