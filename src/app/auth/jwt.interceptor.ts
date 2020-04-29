import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertService } from './alert.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authenticationService.getJwtToken()) {
      this.alertService.error('401');
      this.alertService.clear();
      request = this.authenticationService.addToken(
        request,
        this.authenticationService.getJwtToken()
      );
    }
    return next.handle(request);
  }
}
