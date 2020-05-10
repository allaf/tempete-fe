import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Scavenger } from '@wishtack/rx-scavenger';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { Game, GameUpdate, Turn } from 'src/app/model/game.model';
import { GameService } from '../game.service';
const Chess = require('chess.js');

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
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private gameService: GameService,
    private socket: Socket
  ) {
    // const chess = new Chess();
    // console.log(chess.ascii(), chess.move('e4'));
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
    console.log('i know the game has been changed by someone !!!!!!');

    if (this.game.id === x.id) {
      this.gameSubject.next(x);
      this.game.position = x.position;
      this.chess = new Chess(x.position);
    }
  }

  click() {
    console.log('click');

    this.game.position = this.randFen;
  }

  // handleMoveEnd(m, game) {
  // console.log('handle move', game.id, m);
  // }

  // positionChange(newPos) {
  // console.log('positionChanged what to do ? nothing');
  // }

  moveMade(move) {
    this.chess.move({
      from: move.source,
      to: move.target,
      promotion: null,
    });
    this.game.turn = this.chess.turn();
    this.game.fenHistory.push(this.chess.fen());
    this.game.fenPointer++;
    this.game.position = this.chess.fen();

    // TODO prevenir les autres clients et le serveur du move via WS
    this.socket.emit('gameChange', this.game);
  }

  private fetchGame(id) {
    this.gameService
      .getGame(id)
      .pipe(
        tap((g) => {
          console.log('game fetched');
        })
      )
      .subscribe((g) => {
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
