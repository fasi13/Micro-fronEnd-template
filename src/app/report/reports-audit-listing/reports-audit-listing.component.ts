import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportRecord } from '../../core/models/report/report-record-model';
import { Store } from '@ngrx/store';
import {
  State,
  FetchAuditData,
  getAuditData,
  getAuditDataState,
  FilterAuditData
} from '@forge/core';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  UserPrefenceService,
  PreferenceType
} from 'src/app/core/services/user-prefence.service';

@Component({
  selector: 'fge-reports-listing',
  templateUrl: './reports-audit-listing.component.html'
})
export class ReportsAuditListingComponent implements OnInit, OnDestroy {

  reports$: Observable<ReportRecord[]>;
  loading$: Observable<boolean> | boolean;
  reportsState: any;
  displayMode: string;
  sort: { sortby: string; sortdirection: 'asc' | 'desc' };

  private filters: { [key: string]: string };
  private isAliveComponent = true;

  get pageNumber(): number {
    if (this.reportsState) {
      const { limit, offset } = this.reportsState;
      return Math.ceil(offset / limit) + 1;
    }
    return 0;
  }

  constructor (
    private store: Store<State>,
    private userPreference: UserPrefenceService
  ) {}

  ngOnInit() {
    this.store.dispatch(new FetchAuditData());
    this.reports$ = this.store.select(getAuditData);
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
    this.initSelectors();
    this.userPreference.getPreference(PreferenceType.GROUP_LISTING_VIEW)
    .subscribe((value: string) => {
      this.displayMode = value || 'list';
    });
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  onPageChange(index: number): void {
    const { limit } = this.reportsState;
    const offset = (index - 1) * limit;
    const { sort, filters } = this;
    this.store.dispatch(new FetchAuditData({ offset, limit, filters, sort }));
    window.scrollTo(0, 0);
  }

  onResetFilters(): void {
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
    this.onPerformFilter();
  }

  onPerformFilter(): void {
    const { filters, sort } = this;
    this.store.dispatch(new FilterAuditData({ filters, sort }));
  }

  sortBy(field: string): void {
    const { limit } = this.reportsState;
    const offset = 0;
    if (this.sort.sortby === field) {
      this.sort.sortdirection = this.sort.sortdirection === 'desc' ? 'asc' : 'desc';
    } else {
      this.sort = {
        sortby: field,
        sortdirection: 'asc'
      };
    }
    const { sort, filters } = this;
    console.log(limit, offset, sort, filters);
    this.store.dispatch(new FetchAuditData({limit, offset, sort, filters}));
  }

  private initSelectors() {
    this.store.select(getAuditDataState)
    .pipe(takeWhile(() => this.isAliveComponent))
    .subscribe(reportsState => {
      if (reportsState) {
        this.reportsState = reportsState;
      }
    });
  }
}
