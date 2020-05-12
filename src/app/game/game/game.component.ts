import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Scavenger } from '@wishtack/rx-scavenger';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { Game, MoveMade, Turn } from 'src/app/model/game.model';
import { GameService } from '../game.service';

// const Chess = require('chess.js');

declare const ChessBoard: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  get game() {
    return this.gameSubject.value;
  }
  readonly connectedUser = this.auth.getConnectedUser();

  private scavenger = new Scavenger(this);

  gameSubject = new BehaviorSubject<Game>(null);
  gameChangeObs;

  orientation: boolean;

  // private chess; // not necessary right now
  private mapAsGame = map((res) => Object.assign(new Game(), res as Game));

  playerColor: Turn;

  randFen = '4k1nr/4bppp/8/8/8/8/P3K1PP/R6R b - - 0 16';

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private gameService: GameService,
    private socket: Socket
  ) {
    this.gameSubject.pipe(filter((xx) => !!xx)).subscribe((xxx) => {
      this.game.position = xxx.position;
      // FIXME faire dans le resultat du next
    });
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((r: Params) => {
      this.fetchGame(r.get('id'));
    });

    let op2 = (this.gameChangeObs = this.socket.fromEvent('gameChange').pipe(
      this.scavenger.collect(),
      this.mapAsGame,
      tap((x) => console.log('instanceof ?', x instanceof Game)),
      tap((x: Game) => this.handleGameChange(x))
    ));

    this.gameChangeObs.subscribe();
  }

  handleGameChange(x: Game) {
    if (this.game.id === x.id) {
      this.gameSubject.next(x);
      this.game.position = x.position;
    } else {
      console.log('ce jeu n est pas le mien', this.game.id, x.id);
    }
  }

  click() {
    console.log('click');
    this.game.position = this.randFen;
  }

  moveMade(move: MoveMade) {
    // update the game and send it to server
    let newFen = ChessBoard.objToFen(move.newPos);
    console.log('move', move, newFen);
    this.game.changeTurn();
    this.game.fenHistory.push(newFen);
    this.game.fenPointer++;
    this.game.position = newFen;

    // Prevenir les autres clients et le serveur du move via WS
    this.socket.emit('gameChange', this.game);
  }

  private fetchGame(id) {
    this.gameService
      .getGame(id)
      .pipe(
        this.scavenger.collect(),
        catchError((val) => {
          if (val === 'Not Found') this.router.navigate(['/']);
          return of(null);
        }),
        this.mapAsGame
      )
      .subscribe((g: Game) => {
        // TODO init ?
        this.gameSubject.next(g);
        this.orientation = g.whitePlayer.userId === this.connectedUser.userId;
        this.playerColor =
          this.game.whitePlayer.userId === this.connectedUser.userId
            ? Turn.W
            : Turn.B;
      });
  }

  // private init(g: Game) {}
}
