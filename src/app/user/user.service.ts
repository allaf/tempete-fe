import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private backend: BackendService) {}

  getUser(id: string): Observable<User> {
    return this.backend.get('/users/' + id);
  }

  getConnectedUsers(): Observable<User[]> {
    // return this.backend.get('/users/connected');
    return of(null);
  }
}
