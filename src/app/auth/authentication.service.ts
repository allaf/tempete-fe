import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { map, tap, mapTo, catchError } from 'rxjs/operators';
import { config } from 'src/environments/environment';
import { BackendService } from '../backend.service';
import { User } from '../user/user.model';

const JWT_TOKEN = 'JWT_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const CURRENT_USER = 'CURRENT_USER';

export interface Tokens {
  jwtToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(
    private backendService: BackendService,
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem(CURRENT_USER))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  currentUserSubject = new BehaviorSubject<User>(undefined);
  public currentUser = this.currentUserSubject.asObservable();

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  refreshToken() {
    return this.http
      .post<any>(`${config.backendUrl}/auth/refreshToken`, {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap((tokens: Tokens) => {
          this.storeJwtToken(tokens.jwtToken);
        })
      );
  }

  private getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(JWT_TOKEN, tokens.jwtToken);
    localStorage.setItem(REFRESH_TOKEN, tokens.refreshToken);
  }

  addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(JWT_TOKEN);
  }

  ping() {
    this.backendService.get('/ping').pipe(map(console.log)).subscribe();
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${config.backendUrl}/auth/login`, { username, password })
      .pipe(
        tap((user: User) => {
          this.currentUserSubject.next(user);
          localStorage.setItem(CURRENT_USER, JSON.stringify(user));
          this.storeTokens({
            jwtToken: user.accessToken,
            refreshToken: user.refreshToken,
          });
        })
      );
  }

  logout(): Observable<any> {
    // TODO utiliser backendservice
    console.log('LOGOUT SERVICE');

    // this.backendService.post()
    return this.backendService
      .post('/auth/logout', {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap((x) => {
          console.log('LOGOUT RETOUR', x);
          this.removeTokens();
          this.currentUserSubject.next(null);
        }),
        mapTo(true),
        catchError((error) => {
          alert(error.error);
          return of(false);
        })
      );
  }

  private removeTokens() {
    localStorage.removeItem(CURRENT_USER);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(JWT_TOKEN);
  }
}
