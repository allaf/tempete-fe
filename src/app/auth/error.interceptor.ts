import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private logger: NGXLogger,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.logger.debug('intercept ERROR 401', request);
          return this.handle401Error(request, next);
        } else {
          const errMsg = error.error.message || error.statusText;
          return throwError(errMsg);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): any {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      this.logger.debug('handle 401 is refreshing=true');
      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.logger.debug('afterrefresh token');
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwtToken);
          return next.handle(this.authService.addToken(request, token.jwtToken));
        })
      );
    } else {
      this.logger.debug('handle 401 is refreshing=false');
      this.authService.localLogout(); // ugly but works
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.authService.addToken(request, jwt));
        })
      );

    }
  }
}
