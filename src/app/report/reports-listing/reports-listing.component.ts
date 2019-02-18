import { Component, OnInit } from '@angular/core';
import { Report } from '../../models/report';
import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'fge-reports-listing',
  templateUrl: './reports-listing.component.html'
})
export class ReportsListingComponent implements OnInit {
  reports: Report[];

  constructor(private reportServices: ReportService) {}

  ngOnInit() {
    this.getReports();
  }

  getReports(): void {
    this.reportServices
      .getReports()
      .subscribe(reports => (this.reports = reports));
  }
}
