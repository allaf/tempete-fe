import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'tempete-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.scss'],
})
export class GamelistComponent implements OnInit {
  gamesSubject = new BehaviorSubject<Game[]>(null);
  wait = '';
  // games: Observable<Game[]> = this.behaviorSubject.asObservable();

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames() {
    return this.gameService.getAllGames().subscribe((value) => {
      this.gamesSubject.next(value);
    });
  }

  addGame() {
    this.wait = '...';

    this.gameService.addGame().subscribe((g) => {
      this.getGames();
      this.wait = '';
    });
  }

  onSelect(game: Game) {
    this.router.navigateByUrl('/game/' + game.id);
  }
}
