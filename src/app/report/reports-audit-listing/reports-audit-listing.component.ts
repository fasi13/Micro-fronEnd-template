import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportRecord } from '../../core/models/report/report-record-model';
import { Store } from '@ngrx/store';
import {
  State,
  FetchAuditData,
  getAuditData,
  getAuditDataState
} from '@forge/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'fge-reports-listing',
  templateUrl: './reports-audit-listing.component.html'
})
export class ReportsAuditListingComponent implements OnInit, OnDestroy {
  reports$: Observable<ReportRecord[]>;

  reportsState: any;
  sort: { sortby: string; sortdirection: 'asc' | 'desc' };

  private filters: { [key: string]: string };
  private isAliveComponent = true;
  constructor(private store: Store<State>) {}

  get pageNumber(): number {
    if (this.reportsState) {
      const { limit, offset } = this.reportsState;
      return Math.ceil(offset / limit) + 1;
    }
    return 0;
  }

  ngOnInit() {
    this.store.dispatch(new FetchAuditData());
    this.reports$ = this.store.select(getAuditData);
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
    this.initSelectors();
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

  onPerformFilter(): void {
    const { filters, sort } = this;
    this.store.dispatch(new FetchAuditData({ filters, sort }));
  }

  onResetFilters(): void {
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
    this.onPerformFilter();
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
