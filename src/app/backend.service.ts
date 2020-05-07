import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../environments/environment';
import { Game } from './model/game.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(private http: HttpClient) {}

  put(url: string, body: any | null, options?: any) {
    return this.http.put(config.backendUrl + url, body, options);
  }

  post(url: string, body: any | null, options?: any) {
    console.log('post', config.backendUrl + url);
    return this.http.post(config.backendUrl + url, body, options);
  }

  get(url: string, options?: any): Observable<any> {
    return this.http.get(config.backendUrl + url, options);
  }

  delete(url: string, body?: any | null, options?: any) {
    return this.http.delete(config.backendUrl + url, options);
  }

}
