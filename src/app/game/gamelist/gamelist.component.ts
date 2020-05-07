import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { BackendService } from 'src/app/backend.service';
import { Game, GameStatus } from '../../model/game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'tempete-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.scss'],
})
export class GamelistComponent implements OnInit {
  gamesSubject = new BehaviorSubject<Game[]>(null);

  constructor(
    private gameService: GameService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames() {
    return this.gameService.getAllGames().subscribe((value) => {
      this.gamesSubject.next(value);
    });
  }

  addGame() {
    this.gameService.addGame().subscribe((g) => {
      this.getGames();
    });
  }

  canJoin(game: Game): boolean {
    const user = this.authenticationService.getConnectedUser();
    return (
      user.userId !== game.createdBy.userId && game.status === GameStatus.OPEN
    );
  }

  canSee(game: Game): boolean {
    const user = this.authenticationService.getConnectedUser();
    return (
      user.userId === game.blackPlayer.userId ||
      user.userId === game.whitePlayer.userId
    );
  }

  canDelete(game: Game): boolean {
    const user = this.authenticationService.getConnectedUser();
    return (
      user.userId === game.createdBy.userId && game.status === GameStatus.OPEN
    );
  }

  refreshList() {
    this.getGames();
  }

  async joinGame(game) {
    if (game.status === GameStatus.OPEN) {
      await this.gameService.joinGame(game.id).toPromise();
    }
    this.router.navigateByUrl('/game/' + game.id);
  }

  deleteGame(gameId) {
    this.gameService.deleteGame(gameId).subscribe(() => {
      this.refreshList();
    });
  }
}
