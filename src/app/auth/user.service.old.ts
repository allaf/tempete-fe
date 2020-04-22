import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from 'src/environments/environment';
import { User, Game } from './user.model';


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${config.backendUrl}/users`);
    }

    getAllGames() {
        return this.http.get<Game[]>(`${config.backendUrl}/games`);
    }

    register(user: User) {
        return this.http.post(`${config.backendUrl}/users/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`${config.backendUrl}/users/${id}`);
    }
}
