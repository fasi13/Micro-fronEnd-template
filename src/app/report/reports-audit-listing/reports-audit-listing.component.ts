import { Component, OnInit } from '@angular/core';
import { Report } from '../../core/models/report/report-model';
import { Store } from '@ngrx/store';
import { State, FetchAuditData, getAuditData } from '@forge/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'fge-reports-listing',
  templateUrl: './reports-audit-listing.component.html'
})
export class ReportsAuditListingComponent implements OnInit {
  reports$: Observable<Report[]>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.store.dispatch(new FetchAuditData());
    this.reports$ = this.store.select(getAuditData);
  }
}
