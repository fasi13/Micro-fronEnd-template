import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, getUsers, User } from '@forge/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'fge-role-users',
  templateUrl: './role-users.component.html',
})
export class RoleUsersComponent implements OnInit {

  users$: Observable<User[]>;
  selectedUsers: User[];

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.selectedUsers = [];
    this.users$ = this.store.select(getUsers);
  }

  trackByUserId(_index, item: User): number {
    return item.id;
  }

  isUserSelected(user: User): boolean {
    return (this.selectedUsers.findIndex(current => current.id === user.id) >= 0);
  }

  onAddUserClicked(event: Event, user: User) {
    event.stopPropagation();
    if (user) {
      this.selectedUsers.push(user);
    }
  }

  onRemoveUserClicked(event: Event, user: User) {
    event.stopPropagation();
    if (user) {
      const index = this.selectedUsers.findIndex(current => current.id === user.id);
      this.selectedUsers.splice(index, 1);
    }
  }

}
