import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private backendService: BackendService) {}

  // getObs() {
    // return this.backendService.get('/obs');
  // }
}
