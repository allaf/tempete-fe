import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GamelistComponent } from '../game/gamelist/gamelist.component';
import { HomeService } from './home.service';

const Chess = require('chess.js');

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
    // const fen = '1r3rk1/2pb1pp1/p1np4/1p1Bp1q1/4PP2/2PP4/PP4PP/R2Q1RK1 b - - 0 17';

    // FIXME crado non ?
    // this.child.refreshList();
  }

  ngOnInit() {}
}
