import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(private http: HttpClient) {}

  get(url: string, options?: any): Observable<any> {
    return this.http.get(config.backendUrl + url, options);
  }
}
