import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { config } from '../environments/environment';
import { catchError } from 'rxjs/operators';
import { AlertService } from './auth/alert.service';

@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(private http: HttpClient, private alert: AlertService) {}

  put(url: string, body: any | null, options?: any) {
    return this.http.put(config.backendUrl + url, body, options);
  }

  post(url: string, body: any | null, options?: any) {
    console.log('post', config.backendUrl + url, body);
    return this.http.post(config.backendUrl + url, body, options);
  }

  get(url: string, options?: any): Observable<any> {
    return this.http.get(config.backendUrl + url, options).pipe(
      catchError((val) => {
        this.alert.error('backend Get error');
        return of(`Errror on GET: ${val}`);
      })
    );
  }

  delete(url: string, body?: any | null, options?: any) {
    return this.http.delete(config.backendUrl + url, options);
  }
}
