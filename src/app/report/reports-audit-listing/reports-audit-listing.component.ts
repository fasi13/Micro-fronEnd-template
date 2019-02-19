import { Component, OnInit } from '@angular/core';
import { Report } from '../../core/models/report/report-model';
import { Store } from '@ngrx/store';
import {
  State,
  FetchAuditData,
  getAuditData,
  FetchAuditReports
} from '@forge/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'fge-reports-listing',
  templateUrl: './reports-audit-listing.component.html'
})
export class ReportsAuditListingComponent implements OnInit {
  reports$: Observable<Report[]>;

  reportsState: any;
  sort: { sortby: string; sortdirection: 'asc' | 'desc' };

  private filters: { [key: string]: string };
  /*get page umber(): number {
    if (this.reportsState) {
      const { limit, offset } = this.reportsState;
      return Math.ceil(offset / limit) + 1;
    }
    return 0;
  }*/

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.store.dispatch(new FetchAuditData());
    this.reports$ = this.store.select(getAuditData);
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
  }

  /*onPageChange(index: number): void {
    const { limit } = this.reportsState;
    const offset = (index - 1) * limit;
    const { sort, filters } = this;
    this.store.dispatch(new FetchReports({ offset, limit, filters, sort }));
    window.scrollTo(0, 0);
  }*/

  onPerformFilter(): void {
    const { filters, sort } = this;
    this.store.dispatch(new FetchAuditReports({ filters, sort }));
  }

  onResetFilters(): void {
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
    this.onPerformFilter();
  }
}
