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

declare const ChessBoard: any;

@Component({
  selector: 'ng2-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css'],
})
export class ChessboardComponent implements OnInit {
  board: any;

  width = '300px';


  @Input() size = '100px';

  myStyle = {
    // 'background-color': 'red',
    // 'font-size': '5px',
    // 'font-weight': 'bold',
    width: this.size,
  };

  private _position: any = 'start';
  private _orientation = true;
  private _showNotation = true;
  private _draggable = false;
  private _dropOffBoard = 'snapback';
  private _pieceTheme: any = 'assets/chesspieces/wikipedia/{piece}.png';
  private _moveSpeed: any = 200;
  private _snapbackSpeed: any = 500;
  private _snapSpeed: any = 100;
  private _sparePieces = false;

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
  @Output() onchange = new EventEmitter();
  @Output() dragStart = new EventEmitter();
  @Output() dragMove = new EventEmitter();
  @Output() ondrop = new EventEmitter();
  @Output() snapbackEnd = new EventEmitter();
  @Output() moveEnd = new EventEmitter();

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
  get pieceTheme(): any {
    return this._pieceTheme;
  }

  @Input()
  set pieceTheme(value: any) {
    this._pieceTheme = value instanceof Function ? value() : value;
    if (this.board) {
      this.load();
    }
    this.pieceThemeChange.emit(this._pieceTheme);
  }

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

  ngOnInit() {
    this.load();
  }

  private onChangeHandler(oldPos: any, newPos: any) {
    this.onchange.emit({ oldPos, newPos });
  }

  // PRIVATE
  private onDragStart(
    source: string,
    piece: string,
    position: any,
    orientation: string
  ) {
    this.dragStart.emit({ source, piece, position, orientation });
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

  private onDrop(
    source: string,
    target: string,
    piece: string,
    newPos: any,
    oldPos: any,
    orientation: string
  ) {
    this._position = newPos;
    this.positionChange.emit(this._position);
    this.ondrop.emit({ source, target, piece, newPos, oldPos, orientation });
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

  private load() {
    this.board = ChessBoard('ng2-board', {
      position: this._position,
      orientation: this._orientation ? 'white' : 'black',
      showNotation: this._showNotation,
      draggable: this._draggable,
      dropOffBoard: this._dropOffBoard,
      pieceTheme: this._pieceTheme,
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
}
