import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { HomeService } from './home.service';
import { GamelistComponent } from '../game/gamelist/gamelist.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  public users = 0;

  @ViewChild(GamelistComponent) child: GamelistComponent;

  // FIXME refresh list games on /home
  constructor(
    private chatService: ChatService,
    private homeService: HomeService
  ) {}

  ngAfterViewInit(): void {
    this.child.refreshList();
  }

  ngOnInit() {
    this.chatService.getUsers().subscribe((users: number) => {
      this.users = users;
    });
  }

  sendEvent() {
    this.chatService.sendEvent();
  }
}
