import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import { RouterLink, Router } from '@angular/router';

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
    this.gameService.getAllGames().subscribe((x) => console.log(x));
  }

  onSelect(g: Game) {
    console.log('selected', g);
    this.selectedGame = g;
    this.router.navigateByUrl('/game/' + g.id);
  }
}
