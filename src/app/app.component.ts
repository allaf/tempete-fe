import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './auth/auth.service';
import { User } from './user/user.model';


@Component({ selector: 'tempete-app', templateUrl: 'app.component.html' })
export class AppComponent {
  currentUser: Observable<User>;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUser;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
