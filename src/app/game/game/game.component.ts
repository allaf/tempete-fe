import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Scavenger } from '@wishtack/rx-scavenger';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { Game, GameStatus, MoveMade, Turn } from 'src/app/model/game.model';
import { GameService } from '../game.service';
// import { Chess } from 'chess.js';

const Chess = require('chess.js');

declare const ChessBoard: any; // TODO put in game service

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  readonly connectedUser = this.auth.getConnectedUser();

  private scavenger = new Scavenger(this);
  private mapAsGame = map((res) => Object.assign(new Game(), res as Game));

  gameSubject = new BehaviorSubject<Game>(null);
  gameChangeObs;

  orientation: boolean;

  playerColor: Turn;

  chess = new Chess();

  randFen = '4k1nr/4bppp/8/8/8/8/P3K1PP/R6R b - - 0 16';
  lockPieces = false;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private gameService: GameService,
    private socket: Socket
  ) {
    this.gameSubject.pipe(filter((g) => !!g)).subscribe((g) => {
      this.game.position = g.position;

      if (this.chess.load(g.position)) {
        console.log(this.chess.ascii());
      } else {
        console.error('chessjs: cannot load position');
      }

      // TODO ?? update lockPieces ?
    });
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((p: Params) => {
      this.fetchGame(p.get('id'));
    });

    this.gameChangeObs = this.socket.fromEvent('gameChange').pipe(
      this.scavenger.collect(),
      this.mapAsGame,
      tap((x: Game) => this.handleGameChange(x))
    );

    this.gameChangeObs.subscribe();
  }

  handleGameChange(g: Game) {
    if (this.game.id === g.id) {
      this.gameSubject.next(g);
      this.game.position = g.position;
    } else {
      console.error('Not my game', this.game.id, g.id);
    }
  }

  resign() {
    this.game.status = GameStatus.FINISHED_RESIGN;
    this.socket.emit('gameChange', this.game);
  }

  isMyTurn() {
    return this.game.turn === this.getPlayerColor();
  }

  // moveMade(move: MoveMade) {
  //   // Update the game and send it to the server
  //   const newFen = ChessBoard.objToFen(move.newPos);
  //   console.log('move', move, newFen);
  //   this.game.changeTurn();
  //   this.game.fenHistory.push(newFen);
  //   this.game.fenPointer++;
  //   this.game.position = newFen;
  //   this.game.move = { source: move.source, target: move.target };

  //   // Prevenir les autres clients et le serveur du move via WS
  //   this.socket.emit('gameChange', this.game);
  // }
  moveMade(move: MoveMade) {
    // Update the game and send it to the server
    console.log('the move', move);
    console.log('s', this.chess.ascii());
    const moveRes = this.chess.move({
      from: move.source,
      to: move.target,
      promotion: 'q',
    });
    if (moveRes === null) {
      console.error('chessjs cannot make move');
      return;
    } else {
      console.log('move chessjs ok');
    }

    const newFen = this.chess.fen();
    console.log('move', move, newFen);
    this.game.changeTurn();
    this.game.fenHistory.push(newFen);
    this.game.fenPointer++;
    this.game.position = newFen;
    this.game.move = { source: move.source, target: move.target };

    if (this.chess.game_over()) {
      console.log('GAMEOVER', this.chess.turn());
      if (this.chess.in_checkmate()) {
        this.game.status = GameStatus.FINISHED_MATE;
      }
      // in_draw
      // in_stalemate
      // in_threefold_repetition
    }

    // Prevenir les autres clients et le serveur du move via WS
    this.socket.emit('gameChange', this.game);
  }

  showPreviousPosition() {
    if (this.game.fenPointer === 0) {
      return;
    }
    this.game.fenPointer--;
    this.showFenPointer();
    this.lockPieces = true;
  }

  showNextPosition() {
    if (this.game.fenPointer === this.game.fenHistory.length - 1) {
      return;
    }
    this.game.fenPointer++;
    this.showFenPointer();

    this.lockPieces = this.game.fenPointer < this.game.fenHistory.length - 1;
  }

  get game() {
    return this.gameSubject.value;
  }

  private showFenPointer() {
    this.cleanHighlights();
    // if (this.configuration.playSounds) {
    // this.playAudio('move');
    // }
    this.game.position = this.game.fenHistory[this.game.fenPointer];
    this.game.move = this.game.moveHistory[this.game.fenPointer - 1];
  }

  private cleanHighlights() {
    // TODO put in  ServiceUtils
    document.querySelectorAll('.highlight-square').forEach((square) => {
      square.classList.remove('highlight-square');
    });
  }

  private fetchGame(id) {
    this.gameService
      .getGame(id)
      .pipe(
        this.scavenger.collect(),
        catchError((val) => {
          if (val === 'Not Found') {
            this.router.navigate(['/']);
          }
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
            ? Turn.WHITE
            : Turn.BLACK;
      });
  }

  private getPlayerColor() {
    return this.game.whitePlayer.userId === this.connectedUser.userId
      ? Turn.WHITE
      : Turn.BLACK;
  }
}
