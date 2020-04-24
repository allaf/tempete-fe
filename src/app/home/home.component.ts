import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/auth.service';
import { User } from '../user/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentUser: User;
  games = [];

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {}
}
