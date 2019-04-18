import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  State,
  FetchAuditData,
  ExportAuditData,
  getAuditData,
  getAuditState,
} from '@forge/core';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ReportRecord } from '../../core/models/report/report-record.model';

@Component({
  selector: 'fge-audit-report',
  templateUrl: './audit-report.component.html'
})
export class AuditReportComponent implements OnInit, OnDestroy {
  @ViewChild('datepicker') input: NgbInputDatepicker;

  reports$: Observable<ReportRecord[]>;
  reportsState: any;
  sort: { sortby: string; sortdirection: 'asc' | 'desc' };

  hoveredDate: any;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  range_date = '';

  private filters: { [key: string]: string } = {};
  private isAliveComponent = true;
  private equals = (one: NgbDateStruct, two: NgbDateStruct) =>
            one && two && two.year === one.year && two.month === one.month && two.day === one.day
  private before = (one: NgbDateStruct, two: NgbDateStruct) =>
            !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
            ? false : one.day < two.day : one.month < two.month : one.year < two.year
  private after = (one: NgbDateStruct, two: NgbDateStruct) =>
          !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
          ? false : one.day > two.day : one.month > two.month : one.year > two.year

  get pageNumber(): number {
    if (this.reportsState) {
      const { limit, offset } = this.reportsState;
      return Math.ceil(offset / limit) + 1;
    }
    return 0;
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate
              && this.after(date, this.fromDate) && this.before(date, this.hoveredDate)
  isInside = date => this.after(date, this.fromDate) && this.before(date, this.toDate);
  isFrom = date => this.equals(date, this.fromDate);
  isTo = date => this.equals(date, this.toDate);

  constructor (
    private store: Store<State>
  ) {}

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
    this.range_date = '';
    this.onPerformFilter();
  }

  onPerformFilter(): void {
    const { filters } = this;
    this.store.dispatch(new FetchAuditData({ filters }));
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && this.after(date, this.fromDate)) {
      const toDateStr =  this.parseDateToStr(date);
      const fromDateStr = this.parseDateToStr(this.fromDate);
      this.toDate = date;
      this.range_date = `${fromDateStr} to ${toDateStr}`;
      this.filters.actionDateStart = fromDateStr;
      this.filters.actionDateEnd = toDateStr;
      this.input.close();
      this.onPerformFilter();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
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
    this.store.dispatch(new FetchAuditData({limit, offset, sort, filters}));
  }

  private parseDateToStr(date: NgbDateStruct): string {
    let dateStr = '';
    if (date) {
      dateStr = `${date.year}-${date.month}-${date.day}`;
    }
    return dateStr;
  }

  exportAuditData() {
    const { filters, sort } = this;
    this.store.dispatch(new ExportAuditData({sort, filters}));
  }

  private initSelectors() {
    this.store.select(getAuditState)
    .pipe(takeWhile(() => this.isAliveComponent))
    .subscribe(reportsState => {
      if (reportsState) {
        this.reportsState = reportsState;
      }
    });
    this.store.dispatch(new FetchAuditData());
    this.reports$ = this.store.select(getAuditData);
  }
}
