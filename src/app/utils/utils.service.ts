import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Game } from '../model/game.model';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  mapAsGame = map(this.asGame);

  constructor() {}

  asGame(g) {
    return Object.assign(new Game(), g as Game);
  }
}
