import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  sendChat(message) {
    this.socket.emit('test', message);
  }

  sendEvent() {
    this.socket.emit('events', { events: { some: 'data en socketio' } });
  }

  receiveChat(): Observable<any> {
    return this.socket.fromEvent('chat');
  }

  getUsers(): Observable<any> {
    return this.socket.fromEvent('users');
  }
}
