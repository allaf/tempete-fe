import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Scavenger } from '@wishtack/rx-scavenger';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, filter, tap, map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { Game, MoveMade, Turn } from 'src/app/model/game.model';
import { GameService } from '../game.service';

const Chess = require('chess.js');

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

  private chess; // = new Chess();
  playerColor: Turn;

  randFen = '4k1nr/4bppp/8/8/8/8/P3K1PP/R6R b - - 0 16';

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private gameService: GameService,
    private socket: Socket
  ) {
    let newFen = ChessBoard.objToFen({});
    console.log('FEN', newFen);

    this.gameSubject.pipe(filter((xx) => !!xx)).subscribe((xxx) => {
      this.game.position = xxx.position;
      this.chess = new Chess(xxx.position);
      // FIXME faire dans le resultat du next
    });
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((r: Params) => {
      this.fetchGame(r.get('id'));
    });

    this.gameChangeObs = this.socket.fromEvent('gameChange').pipe(
      this.scavenger.collect(),
      tap((x: Game) => this.handleGameChange(x))
    );

    this.gameChangeObs.subscribe();
  }

  handleGameChange(x: Game) {
    if (this.game.id === x.id) {
      this.gameSubject.next(x);
      this.game.position = x.position;
      this.chess = new Chess(x.position); // FIXME faire dans le resultat du next
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
    // let newFen = this.gameService.convertPosToFen(move.newPos);

    console.log("move",move)
    let newFen = Chessboard.objToFen(move.newPos);

    const mv = this.chess.move({
      from: move.source,
      to: move.target,
      promotion: null,
    });

    console.log('MV', mv, newFen);
    // this.game.changeTurn();
    // this.game.toto();
    // this.game.fenHistory.push(newFen);
    // this.game.fenPointer++;
    // this.game.position = newFen;

    // Prevenir les autres clients et le serveur du move via WS
    // this.socket.emit('gameChange', this.game);
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
        map((res) => Object.assign(new Game(), res as Game))
      )
      .subscribe((g: Game) => {
        // TODO init ?
        this.gameSubject.next(g);
        this.orientation = g.whitePlayer.userId === this.connectedUser.userId;
        this.chess = new Chess(g.position);
        this.playerColor =
          this.game.whitePlayer.userId === this.connectedUser.userId
            ? Turn.W
            : Turn.B;
      });
  }

  // private init(g: Game) {}
}
