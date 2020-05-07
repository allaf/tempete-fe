import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../backend.service';
import { UserService } from '../user/user.service';
import { User } from '../model/user.model';

@Component({
  selector: 'tempete-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(
    private backendService: BackendService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.users$ = this.userService.getConnectedUsers();
  }
}
