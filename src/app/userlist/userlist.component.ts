import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { BackendService } from '../backend.service';
import { UserService } from '../user/user.service';

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
