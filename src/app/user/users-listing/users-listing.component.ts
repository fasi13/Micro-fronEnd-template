import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';

import { State, UserTransaction, getUserRecordState, getUsersState, FetchUsers, ApplicationPath } from '@forge/core';
import { ModalConfirmConfig } from '../../shared/components/modal-confirm/modal-confirm.model';

@Component({
  selector: 'fge-users',
  templateUrl: './users-listing.component.html'
})
export class UsersListgingComponent implements OnInit, OnDestroy {
  @ViewChild('datepicker') input: NgbInputDatepicker;

  config: ModalConfirmConfig;
  currentUser: any;
  usersState: any;
  titleModalConfirm: string;
  messageConfirmModal: string;
  confirmModal: any;
  hoveredDate: any;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  range_date = '';
  sort: { sortby: string, sortdirection: 'asc' | 'desc' };

  private filters: { [key: string]: string };
  private readonly initialOffset = 0;
  private readonly initialLimit = 12;
  private isAliveComponent = true;
  private unsubscribeListing = new Subject();
  private equals = (one: NgbDateStruct, two: NgbDateStruct) =>
            one && two && two.year === one.year && two.month === one.month && two.day === one.day
  private before = (one: NgbDateStruct, two: NgbDateStruct) =>
            !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
            ? false : one.day < two.day : one.month < two.month : one.year < two.year
  private after = (one: NgbDateStruct, two: NgbDateStruct) =>
          !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
          ? false : one.day > two.day : one.month > two.month : one.year > two.year

  get pageNumber(): number {
    if (this.usersState) {
      const { limit, offset } = this.usersState;
      return Math.ceil(offset / limit) + 1;
    }
    return 0;
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate
              && this.after(date, this.fromDate) && this.before(date, this.hoveredDate)
  isInside = date => this.after(date, this.fromDate) && this.before(date, this.toDate);
  isFrom = date => this.equals(date, this.fromDate);
  isTo = date => this.equals(date, this.toDate);

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
    this.store.dispatch(new FetchUsers({ limit: this.initialLimit, offset: this.initialOffset, sort: this.sort }));
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
    const name = user.applicationPath.path[user.applicationPath.path.length - 1 ].name;
    return name;
  }

  getApplicationPath(application: ApplicationPath): string {
    const appPath = application.path;
    let strPath = '';
    appPath.forEach((element, index, array) => {
      if (element) {
        const separator = index === array.length - 1 ? '' : ' > ';
        const elementId = (element && +element.value > -1) ? ` (${element.value})` : '';
        strPath += `${element.name}${elementId}${separator}`;
      }
    });
    return strPath;
  }

  onPageChange(index: number): void {
    const { limit } = this.usersState;
    const offset = (index - 1) * limit;
    const { sort } = this;
    this.store.dispatch(new FetchUsers({ offset, limit, sort }));
  }

  onPerformFilter(): void {
    const { initialLimit: limit, initialOffset: offset, filters, sort } = this;
    this.store.dispatch(new FetchUsers({ limit, offset, filters, sort }));
  }

  onResetFilters(): void {
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
    this.range_date = '';
    this.onPerformFilter();
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && this.after(date, this.fromDate)) {
      const toDateStr =  this.parseDateToStr(date);
      const fromDateStr = this.parseDateToStr(this.fromDate);
      this.toDate = date;
      this.range_date = `${fromDateStr} to ${toDateStr}`;
      this.filters.from = fromDateStr;
      this.filters.to = toDateStr;
      this.input.close();
      this.onPerformFilter();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
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
    const { sort, initialOffset, initialLimit, filters } = this;
    this.store.dispatch(new FetchUsers({ limit: initialLimit, offset: initialOffset, sort, filters }));
  }

  private parseDateToStr(date: NgbDateStruct): string {
    let dateStr = '';
    if (date) {
      dateStr = `${date.year}-${date.month}-${date.day}`;
    }
    return dateStr;
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
