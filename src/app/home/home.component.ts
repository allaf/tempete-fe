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
  }

  ngOnInit() {}
}
