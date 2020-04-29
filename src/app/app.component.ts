import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './auth/authentication.service';
import { User } from './user/user.model';
import { NGXLogger } from 'ngx-logger';

@Component({ selector: 'tempete-app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
  currentUser: Observable<User>;
  title = 'Tempête sur l\'échiquier online';

  constructor(
    private logger: NGXLogger,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUser;
  }

  async logout() {
    const res = await this.authenticationService.logout().toPromise();
    if (res) {
      this.logger.debug('logout fini OK je redirige vers login');
      this.router.navigate(['/login']);
    } else {
      this.logger.debug('logout fini ERROR je fais RIEN');
    }
  }
}
