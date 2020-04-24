import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BackendService } from '../backend.service';
import { map, filter, first, concatAll, tap } from 'rxjs/operators';
import { Game } from './game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  games: Observable<Game[]>;

  constructor(private backendService: BackendService) {
    this.games = this.backendService.get('/game/list').pipe(map((g) => g));
  }

  getGame(id: string): Observable<Game> {
    return this.games.pipe(
      map((gameList: Game[]) => gameList.filter((g: Game) => g.id === id)),
      concatAll()
    );
  }

  getAllGames(): Observable<Game[]> {
    return this.games;
  }
}
