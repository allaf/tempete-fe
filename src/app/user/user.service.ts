import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private backend: BackendService) {}

  getUser(id: string): Observable<User> {
    return this.backend.get('/users/' + id);
  }
}
