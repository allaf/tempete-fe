import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public users = 0;

  constructor(private chatService: ChatService,
              private homeService: HomeService) {}
  ngOnInit() {
    this.chatService.getUsers().subscribe((users: number) => {
      this.users = users;
    });

  }

  sendEvent() {
    this.chatService.sendEvent();
  }
}
