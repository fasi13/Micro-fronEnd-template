import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State, UserTransaction, isLoadingUsers, getUsers,  FetchUsers } from '@forge/core';
import { ModalConfirmConfig } from '../../shared/components/modal-confirm/modal-confirm.model';
@Component({
  selector: 'fge-users',
  templateUrl: './users-listing.component.html'
})
export class UsersListgingComponent implements OnInit {
  config: ModalConfirmConfig;
  currentUser: any;
  titleModalConfirm: string;
  messageConfirmModal: string;
  confirmModal: any;
  users$: Observable<any>;
  loading$: Observable<boolean> | boolean;
  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.initSelectors();
    this.store.dispatch(new FetchUsers());
  }

  private initSelectors() {
    this.loading$ = this.store.select(isLoadingUsers);
    this.users$ = this.store.select(getUsers);
  }

  openModalConfirm(confirmModal: any, user: any): void {
    this.confirmModal = confirmModal;
    this.currentUser = user;
    const labelAction = user.isActive ? 'disable ' : 'enable';
    this.config = {
      title: 'Enable/Disable user confirmation',
      message: `Do you want to ${labelAction} the user ${user.login}?`,
      submitLabel: 'Accept',
      cancelLabel: 'Cancel'
    };
    confirmModal.open();
  }

  submit() {
    this.store.select(isLoadingUsers).subscribe(() => {
      this.confirmModal.close();
    });

    this.store.dispatch(new UserTransaction({
      id: this.currentUser.id,
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      emailAddress: this.currentUser.email,
      isActive: !this.currentUser.isActive,
    }, 'PUT'));
  }

  getApplicationName(user: any): string {
    const name = user.applicationPath.path[user.applicationPath.path.length - 1 ].name;
    return name;
  }
}
