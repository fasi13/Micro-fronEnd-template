import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { State, UserTransaction, getUsersState, FetchUsers } from '@forge/core';
import { ModalConfirmConfig } from '../../shared/components/modal-confirm/modal-confirm.model';
@Component({
  selector: 'fge-users',
  templateUrl: './users-listing.component.html'
})
export class UsersListgingComponent implements OnInit {
  config: ModalConfirmConfig;
  currentUser: any;
  usersState: any;
  titleModalConfirm: string;
  messageConfirmModal: string;
  confirmModal: any;

  get pageNumber(): number {
    if (this.usersState) {
      const { limit, offset } = this.usersState;
      return Math.ceil(offset / limit) + 1;
    }
    return 0;
  }

  private filters: { [key: string]: string } = {};
  private readonly initialOffset = 0;
  private readonly initialLimit = 12;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.initSelectors();
    this.store.dispatch(new FetchUsers({ limit: this.initialLimit, offset: this.initialOffset }));
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

  onSubmitConfirmModal() {
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

  onPageChange(index: number): void {
    const { limit } = this.usersState;
    const offset = (index - 1) * limit;
    this.store.dispatch(new FetchUsers({ offset, limit }));
  }

  onPerformFilter(): void {
    const { initialLimit: limit, initialOffset: offset, filters } = this;
    this.store.dispatch(new FetchUsers({ limit, offset, filters }));
  }

  onResetFilters(): void {
    this.filters = {};
    this.onPerformFilter();
  }

  private initSelectors() {
    this.store.select(getUsersState)
      .subscribe(usersState => {
        if (usersState) {
          this.usersState = usersState;
        }
      });
  }
}
