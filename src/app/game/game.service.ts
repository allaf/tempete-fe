import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { Game } from '../model/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  games: Observable<Game[]>;

  constructor(private backendService: BackendService) {
    this.games = this.backendService.get('/game/list').pipe(
      map((g) => g),
      share()
    );
  }

  handleUpdate(x: any) {}

  joinGame(gameId): Observable<any> {
    return this.backendService
      .put('/game/' + gameId + '/join', null)
      .pipe(tap());
  }

  deleteGame(gameId): Observable<any> {
    return this.backendService.delete('/game/' + gameId).pipe(tap());
  }

  addGame() {
    return this.backendService.post('/game', null);
  }

  getGame(id: string): Observable<Game> {
    return this.backendService.get('/game/' + id).pipe();
  }

  getAllGames(): Observable<Game[]> {
    return this.games;
  }

}
