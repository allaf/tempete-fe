import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { config } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WsService implements OnDestroy {
  wsSubject: WebSocketSubject<any>;

  constructor() {
    if (config.useWSPRotocol) {
      this.wsSubject = webSocket('ws://localhost:8080');
      this.wsSubject.subscribe((x) => {
        console.log('subscribed');
      });
      this.wsSubject.next({ events: 'some message from frontend ' });
    }
  }

  ngOnDestroy(): void {
    this.wsSubject.complete();
  }

  sendEvent() {
    console.log('SEND EVENT');
    this.wsSubject.next({ event: 'events', data: 'data de angular' });
  }
}
