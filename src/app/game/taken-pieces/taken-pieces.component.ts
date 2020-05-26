import { Component, OnInit, Input } from '@angular/core';
import { TakenPiece } from 'src/app/model/game.model';

// const Chess = require('chess.js');

import * as Chess from 'chess.js';

@Component({
  selector: 'tempete-taken-pieces',
  templateUrl: './taken-pieces.component.html',
  styleUrls: ['./taken-pieces.component.scss'],
})
export class TakenPiecesComponent implements OnInit {
  @Input() pieces: TakenPiece[];
  @Input() width;

  constructor() {
    const c = new Chess();
    console.log(c.ascii());
  }

  ngOnInit(): void {}

  getImg(p: TakenPiece): string {
    return (
      '/assets/pieces/cburnett/' +
      p.piece.color +
      p.piece.type.toUpperCase() +
      '.svg'
    );
  }

  drag(ev) {
    ev.dataTransfer.setData('text', 'some piece info');
    const img = new Image(this.width, this.width);
    img.src = '/assets/pieces/cburnett/wP.svg';
    // ev.dataTransfer.setDragImage(img, 0, 0);
    console.log('DRAG', ev);
  }
}
