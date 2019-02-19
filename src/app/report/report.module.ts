import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsAuditListingComponent } from './reports-audit-listing/reports-audit-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', redirectTo: 'audit' },
  {
    path: 'audit',
    component: ReportsAuditListingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule, CommonModule],
  declarations: [ReportsAuditListingComponent]
})
export class ReportModule {}
