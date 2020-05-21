import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GamelistComponent } from '../game/gamelist/gamelist.component';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  public users = 0;

  @ViewChild(GamelistComponent) child: GamelistComponent;

  constructor(private homeService: HomeService) {}

  ngAfterViewInit(): void {
    // FIXME crado non ?
    // this.child.refreshList();

    // const Chess = require('chess.js');
    // const chess = new Chess('rnbqkbnr/ppp1pppp/3p4/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1');
    // console.log('before',chess.ascii());
    // const moveRes = chess.move({
    //   from: 'e2',
    //   to: 'e4',
    //   promotion: 'q',
    // });
    // if (moveRes === null) {
    //   console.error('chessjs cannot make move');
    //   return;
    // } else {
    //   console.log('after',chess.ascii(), chess.fen());

    // }
  }

  ngOnInit() {}
}
