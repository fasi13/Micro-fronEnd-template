import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, UserTransaction, getUserRecordState, getUsersState, FetchUsers, User, ExportUserData } from '@forge/core';
import { Subject } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { ModalConfirmConfig } from '../../shared/components/modal-confirm/modal-confirm.model';

@Component({
  selector: 'fge-users',
  templateUrl: './users-listing.component.html'
})
export class UsersListingComponent implements OnInit, OnDestroy {

  config: ModalConfirmConfig;
  currentUser: any;
  usersState: any;
  sort: { sortby: string, sortdirection: 'asc' | 'desc' };

  private confirmModal: any;
  private filters: { [key: string]: string };
  private isAliveComponent = true;
  private unsubscribeListing = new Subject();

  get pageNumber(): number {
    if (this.usersState) {
      const { limit, offset } = this.usersState;
      return Math.ceil(offset / limit) + 1;
    }
    return 0;
  }

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
    this.initSelectors();
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.unsubscribeListing.complete();
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
    this.store.select(getUserRecordState)
      .pipe(takeUntil(this.unsubscribeListing))
      .subscribe((recordState) => {
        const { error: errorData, loading } = recordState;
        if (errorData) {
          this.unsubscribeListing.next();
        } else if (!loading) {
          this.unsubscribeListing.next();
          this.confirmModal.close();
        }
      });
  }

  getApplicationName(user: any): string {
    return user.applicationPath.path[user.applicationPath.path.length - 1 ].name;
    
  }

  onPageChange(index: number): void {
    const { limit } = this.usersState;
    const offset = (index - 1) * limit;
    const { sort, filters } = this;
    this.store.dispatch(new FetchUsers({ offset, limit, filters, sort }));
    window.scrollTo(0, 0);
  }

  onPerformFilter(): void {
    const { filters, sort } = this;
    this.store.dispatch(new FetchUsers({ filters, sort }));
  }

  onResetFilters(): void {
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
    this.onPerformFilter();
  }

  sortBy(field: string): void {
    if (this.sort.sortby === field) {
      this.sort.sortdirection = this.sort.sortdirection === 'desc' ? 'asc' : 'desc';
    } else {
      this.sort = {
        sortby: field,
        sortdirection: 'asc'
      };
    }
    const { sort, filters } = this;
    this.store.dispatch(new FetchUsers({ sort, filters }));
  }

  trackByUserId(_index, item: User): number {
    return item.id;
  }

  exportUserData() {
    const { filters, sort } = this;
    this.store.dispatch(new ExportUserData({ sort, filters }));
  }

  private initSelectors() {
    this.store.select(getUsersState)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe(usersState => {
        if (usersState) {
          this.usersState = usersState;
        }
      });
  }
}
