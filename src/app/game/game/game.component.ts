import { Component, OnInit } from '@angular/core';
import { Game } from '../game.model';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';

import { switchMap, tap } from 'rxjs/operators';
import { GameService } from '../game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game$: Observable<Game>;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((x: Params) => {
      this.game$ = this.gameService.getGame(x.get('id'));
    });
  }
}
