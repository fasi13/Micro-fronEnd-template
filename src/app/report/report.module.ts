import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapModule } from '../ng-bootstrap.module';
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
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    NgBootstrapModule,
    SharedModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [ReportsAuditListingComponent]
})
export class ReportModule {}
