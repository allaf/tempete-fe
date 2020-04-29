import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Game } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'tempete-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.scss'],
})
export class GamelistComponent implements OnInit {
  games: Observable<Game[]>;
  selectedGame: Game;

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.games = this.gameService.getAllGames();
  }

  onSelect(g: Game) {
    this.selectedGame = g;
    this.router.navigateByUrl('/game/' + g.id);
  }
}
