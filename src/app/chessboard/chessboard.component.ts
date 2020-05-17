// tslint:disable: variable-name
// tslint:disable: adjacent-overload-signatures
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  AfterViewInit,
} from '@angular/core';
import { GameStatus, SquareMove, Turn } from '../model/game.model';

declare const ChessBoard: any;
const Chess = require('chess.js');

@Component({
  selector: 'ng2-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss'],
})
export class ChessboardComponent implements OnInit, AfterViewInit {
  board: any;
  @Input() animation = true;
  @Input() width = '300px';

  private _position: any = 'start';
  private _orientation = true;
  private _showNotation = true;
  private _draggable = false;
  private _dropOffBoard = 'snapback';
  private _moveSpeed: any = 200;
  private _snapbackSpeed: any = 500;
  private _snapSpeed: any = 100;
  private _sparePieces = false;
  private _move: SquareMove;

  @Output() animationChange = new EventEmitter<boolean>();

  @Output() positionChange = new EventEmitter<any>();
  @Output() orientationChange = new EventEmitter<boolean>();
  @Output() showNotationChange = new EventEmitter<boolean>();
  @Output() draggableChange = new EventEmitter<boolean>();
  @Output() dropOffBoardChange = new EventEmitter<string>();
  @Output() pieceThemeChange = new EventEmitter();
  @Output() moveSpeedChange = new EventEmitter<any>();
  @Output() snapbackSpeedChange = new EventEmitter<any>();
  @Output() snapSpeedChange = new EventEmitter<any>();
  @Output() sparePiecesChange = new EventEmitter<boolean>();

  // EVENTS
  @Output() changeEvent = new EventEmitter();
  @Output() dragStart = new EventEmitter();
  @Output() dragMove = new EventEmitter();
  @Output() dropEvent = new EventEmitter();
  @Output() snapEnd = new EventEmitter();
  @Output() moveEnd = new EventEmitter();

  //////////////
  @Output() moveMade = new EventEmitter();
  @Input() player: Turn;
  @Input() turn: string;
  @Input() gameStatus: GameStatus;
  @Input() lockPieces: boolean;
  @Input() gamePosition: string;
  //////////////

  // SETTERS
  @Input()
  set lastMove(value: SquareMove) {
    this._move = value;
    if (this.board && !!value) {
      this.highlightSquares(value.source, value.target);
    }
  }

  @Input()
  set dropOffBoard(value: string) {
    this._dropOffBoard = value;
    if (this.board) {
      this.load();
    }
    this.dropOffBoardChange.emit(this._dropOffBoard);
  }

  @Input()
  set draggable(value: boolean) {
    this._draggable = value;
    if (this.board) {
      this.load();
    }
    this.draggableChange.emit(this._draggable);
  }

  @Input()
  set showNotation(value: boolean) {
    this._showNotation = value;
    if (this.board) {
      this.load();
    }
    this.showNotationChange.emit(this._showNotation);
  }

  @Input()
  set position(value: any) {
    this._position = value;
    if (this.board) {
      this.board.position(value, this.animation);
    }
  }

  @Input()
  set orientation(value: boolean) {
    this._orientation = value;
    if (this.board) {
      this.board.orientation(value ? 'white' : 'black');
    }
    this.orientationChange.emit(this._orientation);
  }

  @Input()
  set moveSpeed(value: any) {
    this._moveSpeed = value;
    if (this.board) {
      this.load();
    }
    this.moveSpeedChange.emit(this._moveSpeed);
  }

  @Input()
  set snapbackSpeed(value: any) {
    this._snapbackSpeed = value;
    if (this.board) {
      this.load();
    }
    this.snapbackSpeedChange.emit(this._snapbackSpeed);
  }

  @Input()
  set snapSpeed(value: any) {
    this._snapSpeed = value;
    if (this.board) {
      this.load();
    }
    this.snapSpeedChange.emit(this._snapSpeed);
  }

  @Input()
  set sparePieces(value: boolean) {
    this._sparePieces = value;
    if (this.board) {
      this.load();
    }
    this.sparePiecesChange.emit(this._sparePieces);
  }

  // GETTER
  get snapbackSpeed(): any {
    return this._snapbackSpeed;
  }
  get moveSpeed(): any {
    return this._moveSpeed;
  }
  get lastMove() {
    return this._move;
  }
  get snapSpeed(): any {
    return this._snapSpeed;
  }
  get sparePieces(): boolean {
    return this._sparePieces;
  }
  get orientation(): boolean {
    return this._orientation;
  }
  get dropOffBoard(): string {
    return this._dropOffBoard;
  }
  get position(): any {
    return this._position;
  }
  get showNotation(): boolean {
    return this._showNotation;
  }
  get draggable(): boolean {
    return this._draggable;
  }
  // /GETTER

  constructor() {}
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit chessboard comp', this.lastMove);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // if (this.board) {
    // this.board.resize(event);
    // this.highlightLastMove()
    // }
  }

  // METHODS

  public clear() {
    this.board.clear(this.animation);
  }

  public move(notation: string) {
    this.board.move(notation);
  }

  async ngOnInit() {
    this.load();

    // ugly hack for the board resize to be effective
    await new Promise((r) => setTimeout(r, 0));
    this.board.resize();

    this.highlightLastMove();
  }

  private onChangeHandler(oldPos: any, newPos: any) {
    this.changeEvent.emit({ oldPos, newPos });
  }

  private load() {
    this.board = ChessBoard('ng2-board', {
      position: this._position,
      orientation: this._orientation ? 'white' : 'black',
      showNotation: this._showNotation,
      draggable: this._draggable,
      dropOffBoard: this._dropOffBoard,
      pieceTheme(piece) {
        return '/assets/pieces/cburnett/' + piece + '.svg';
      },
      moveSpeed: this._moveSpeed,
      snapbackSpeed: this._snapbackSpeed,
      snapSpeed: this._snapSpeed,
      sparePieces: this._sparePieces,

      onDragStart: this.onDragStart.bind(this),
      onChange: this.onChangeHandler.bind(this),
      onDragMove: this.onDragMove.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this),
      onMoveEnd: this.onMoveEnd.bind(this),
    });
  }

  private highlightLastMove() {
    if (this.lastMove) {
      this.highlightSquares(this.lastMove.source, this.lastMove.target);
    }
  }

  private onDragStart(
    source: string,
    piece: string,
    position: any,
    orientation: string
  ) {
    console.log('lock du chesscomp', this.lockPieces);

    const moveok =
      !this.lockPieces &&
      piece.startsWith(this.turn) &&
      this.player === this.turn &&
      this.gameStatus !== GameStatus.FINISHED_RESIGN &&
      this.gameStatus !== GameStatus.FINISHED_MATE;

    if (moveok) {
      this.drawGreySquares(source);
    }
    return moveok;
  }

  private drawGreySquares(square) {
    // get list of possible moves for this square
    const moves = new Chess(this.gamePosition).moves({ square, verbose: true });
    // exit if there are no moves available for this square
    if (moves.length === 0) {
      return;
    }

    console.log('possible squares for ', square, moves);

    // highlight the square they moused over
    this.greySquare(square);
    // highlight the possible squares for this piece
    moves.forEach((move) => {
      this.greySquare(move.to);
    });
  }

  private greySquare(square) {
    const squareEl = document.querySelector(`#ng2-board .square-${square}`);
    if (squareEl.classList.contains('black-3c85d')) {
      squareEl.classList.add('move-dest-black');
    } else {
      squareEl.classList.add('move-dest-white');
    }
  }

  private removeGreySquares() {
    document.querySelectorAll('.move-dest-black').forEach((el) => {
      el.classList.remove('move-dest-black');
    });
    document.querySelectorAll('.move-dest-white').forEach((el) => {
      el.classList.remove('move-dest-white');
    });
  }

  private onDrop(
    source: string,
    target: string,
    piece: string,
    newPos: any,
    oldPos: any,
    orientation: string
  ) {
    this.dropEvent.emit({
      source,
      target,
      piece,
      newPos,
      oldPos,
      orientation,
    });
    this.removeGreySquares();
    let newMove = new Chess(this.gamePosition).move({
      from: source,
      to: target,
      promotion: 'q',
    });
    console.log('ISLEGAL', newMove);
    if (source === target || target === 'offboard' || newMove === null) {
      console.warn('bad drop');
      return 'snapback'
    }
    this._position = newPos;
    // TODO check promotion
    this.moveMade.emit({ source, target, newPos });
  }

  private onDragMove(
    newLocation: any,
    oldLocation: any,
    source: string,
    piece: string,
    position: any,
    orientation: string
  ) {
    this.cleanHighlights();
    this.dragMove.emit({
      newLocation,
      oldLocation,
      source,
      piece,
      position,
      orientation,
    });
  }

  private onSnapEnd(
    source: string, // e2
    target: string, // e4
    piece: any // wP,bP
  ) {
    this.snapEnd.emit({ source, target, piece });
    // le reste est fait de base par chessboardjs
    // this.highlightSquares(source, target);
    // console.log('onSnapEnd ===> ', source, target, piece);
  }

  private cleanHighlights() {
    document.querySelectorAll('.highlight-square').forEach((square) => {
      square.classList.remove('highlight-square');
    });
  }

  private highlightSquares(source, target) {
    this.cleanHighlights();
    this.addClass('.square-' + source);
    this.addClass('.square-' + target);
  }

  private addClass(square: string) {
    const el = document.querySelector(square);
    if (el) {
      el.classList.add('highlight-square');
    } else {
      console.log(square, 'notfound');
    }
  }

  private onMoveEnd(oldPos: any, newPos: any) {
    this._position = newPos;
    this.positionChange.emit(this._position);
    this.moveEnd.emit({ oldPos, newPos });
  }
}
