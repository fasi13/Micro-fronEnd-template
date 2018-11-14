import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State, UpdateUserAction, areUsersFetching, areUsersFetched, FetchUsersAction } from '@forge/core';

@Component({
  selector: 'fge-users',
  templateUrl: './users-listing.component.html'
})

export class UsersListgingComponent implements OnInit {
  configConfirmModal: any;
  currentUser: any;
  titleModalConfirm: string;
  messageConfirmModal: string;
  confirmModal: any;
  users$: Observable<any>;
  loading$: Observable<boolean> | boolean;
  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.initSelectors();
    this.store.dispatch(new FetchUsersAction());
  }

  private initSelectors() {
    this.loading$ = this.store.select(areUsersFetching);
    this.users$ = this.store.select(areUsersFetched);
  }

  openModalConfirm(confirmModal: any, user: any): void {
    this.confirmModal = confirmModal;
    this.currentUser = user;
    const labelAction = user.isActive ? 'inactive' : 'active';
    this.titleModalConfirm = 'Active/Inactive user confirmation';
    this.messageConfirmModal = `Do you want to ${labelAction} the user ${user.login}?`;
    confirmModal.open();
  }

  submit() {
    this.store.select(areUsersFetching).subscribe(() => {
      this.confirmModal.close();
    });

    this.store.dispatch(new UpdateUserAction({
      id: this.currentUser.id,
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      emailAddress: this.currentUser.email,
      isActive: !this.currentUser.isActive,
    }));
  }

  getApplicationName(user: any): string {
    const name = user.applicationPath.path[user.applicationPath.path.length - 1 ].name;
    return name;
  }
}
