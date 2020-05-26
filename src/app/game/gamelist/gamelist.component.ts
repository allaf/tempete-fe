import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { Game, GameStatus, Variant } from '../../model/game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'tempete-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.scss'],
})
export class GamelistComponent implements OnInit {
  gamesSubject = new BehaviorSubject<Game[]>(null);

  variant: Variant = Variant.CLASSIC;

  constructor(
    private utils: UtilsService,
    private gameService: GameService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames() {
    this.gameService
      .getAllGames()
      .pipe(map((games) => games.map(this.utils.asGame)))
      .subscribe((value) => {
        this.gamesSubject.next(value);
      });
  }

  addGame() {
    this.gameService.addGame(this.variant).subscribe((g) => {
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
      (game.whitePlayer && user.userId === game.whitePlayer.userId) ||
      (game.blackPlayer && user.userId === game.blackPlayer.userId)
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
