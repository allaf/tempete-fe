import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public users = 0;

  constructor(private chatService: ChatService) {}
  ngOnInit() {
    this.chatService.getUsers().subscribe((users: number) => {
      this.users = users;
    });
  }

  sendEvent() {
    this.chatService.sendEvent();
  }
}
