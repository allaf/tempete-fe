import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatAll, map, share, tap } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { Game, GameStatus } from '../model/game.model';
import { User } from '../model/user.model';

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

  joinGame(gameId): Observable<any> {
    return this.backendService
      .put('/game/' + gameId + '/join', null)
      .pipe(tap((x) => console.log('join game =====>', x)));
  }

  deleteGame(gameId): Observable<any> {
    return this.backendService
      .delete('/game/' + gameId)
      .pipe(tap((x) => console.log(' delete game =====>', x)));
  }

  addGame() {
    return this.backendService.post('/game', null);
  }

  getGame(id: string): Observable<Game> {
    // TODO 404 not found if null
    return this.backendService.get('/game/' + id);
  }

  getAllGames(): Observable<Game[]> {
    return this.games;
  }
}
