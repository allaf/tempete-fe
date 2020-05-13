// tslint:disable-next-line: no-output-native
// tslint:disable: variable-name
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Turn, GameStatus } from '../model/game.model';

declare const ChessBoard: any;

@Component({
  selector: 'ng2-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css'],
})
export class ChessboardComponent implements OnInit {
  get dropOffBoard(): string {
    return this._dropOffBoard;
  }

  @Input()
  set dropOffBoard(value: string) {
    this._dropOffBoard = value;
    if (this.board) {
      this.load();
    }
    this.dropOffBoardChange.emit(this._dropOffBoard);
  }

  get draggable(): boolean {
    return this._draggable;
  }

  @Input()
  set draggable(value: boolean) {
    this._draggable = value;
    if (this.board) {
      this.load();
    }
    this.draggableChange.emit(this._draggable);
  }
  get showNotation(): boolean {
    return this._showNotation;
  }
  @Input()
  set showNotation(value: boolean) {
    this._showNotation = value;
    if (this.board) {
      this.load();
    }
    this.showNotationChange.emit(this._showNotation);
  }

  get position(): any {
    return this._position;
  }

  @Input()
  set position(value: any) {
    this._position = value;
    if (this.board) {
      this.board.position(value, this.animation);
    }
  }

  get orientation(): boolean {
    return this._orientation;
  }

  @Input()
  set orientation(value: boolean) {
    this._orientation = value;
    if (this.board) {
      this.board.orientation(value ? 'white' : 'black');
    }
    this.orientationChange.emit(this._orientation);
  }

  // TODO utile ?
  // get pieceTheme(): any {
  //   return this._pieceTheme;
  // }
  // @Input()
  // set pieceTheme(value: any) {
  //   this._pieceTheme = value instanceof Function ? value() : value;
  //   if (this.board) {
  //     this.load();
  //   }
  //   this.pieceThemeChange.emit(this._pieceTheme);
  // }

  get moveSpeed(): any {
    return this._moveSpeed;
  }

  @Input()
  set moveSpeed(value: any) {
    this._moveSpeed = value;
    if (this.board) {
      this.load();
    }
    this.moveSpeedChange.emit(this._moveSpeed);
  }
  get snapbackSpeed(): any {
    return this._snapbackSpeed;
  }

  @Input()
  set snapbackSpeed(value: any) {
    this._snapbackSpeed = value;
    if (this.board) {
      this.load();
    }
    this.snapbackSpeedChange.emit(this._snapbackSpeed);
  }
  get snapSpeed(): any {
    return this._snapSpeed;
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
  get sparePieces(): boolean {
    return this._sparePieces;
  }
  board: any;

  @Input()
  width = '300px';

  private _position: any = 'start';
  private _orientation = true;
  private _showNotation = true;
  private _draggable = false;
  private _dropOffBoard = 'snapback';
  private _moveSpeed: any = 200;
  private _snapbackSpeed: any = 500;
  private _snapSpeed: any = 100;
  private _sparePieces = false;

  @Input() player: Turn; // TODO hmmm
  @Input() animation = true;
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
  @Output() snapbackEnd = new EventEmitter();
  @Output() moveEnd = new EventEmitter();

  @Output() moveMade = new EventEmitter();

  @Input() turn: string;
  @Input() gameStatus: GameStatus;

  constructor() {}

  // PARAMETERS

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.board) {
      this.board.resize(event);
    }
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
    // ugly hack for the board size to be effective
    await delay(0);
    this.board.resize();
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
      onSnapbackEnd: this.onSnapbackEnd.bind(this),
      onMoveEnd: this.onMoveEnd.bind(this),
    });
  }

  private onDragStart(
    source: string,
    piece: string,
    position: any,
    orientation: string
  ) {
    return (
      piece.startsWith(this.turn) &&
      this.player === this.turn &&
      this.gameStatus !== GameStatus.FINISHED_RESIGN &&
      this.gameStatus !== GameStatus.FINISHED_MATE
    );
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

    this._position = newPos;

    if (source === target) {
      return;
    }
    // TODO validate move
    // TODO check promotion

    console.log('ONDROP newPos', newPos);

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
    this.dragMove.emit({
      newLocation,
      oldLocation,
      source,
      piece,
      position,
      orientation,
    });
  }

  private onSnapbackEnd(
    piece: string,
    square: string,
    position: any,
    orientation: string
  ) {
    this.snapbackEnd.emit({ piece, square, position, orientation });
  }

  private onMoveEnd(oldPos: any, newPos: any) {
    this._position = newPos;
    this.positionChange.emit(this._position);
    this.moveEnd.emit({ oldPos, newPos });
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
