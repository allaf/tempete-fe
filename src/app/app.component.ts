import { Component } from '@angular/core';
import { Router } from '@angular/router';

import './app.less';
import { User } from './auth/user.model';
import { AuthenticationService } from './auth/auth.service';

@Component({ selector: 'tempete-app', templateUrl: 'app.component.html' })
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
