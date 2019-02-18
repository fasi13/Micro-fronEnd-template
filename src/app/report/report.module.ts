import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsListingComponent } from './reports-listing/reports-listing.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'audit' },
  {
    path: 'audit',
    component: ReportsListingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [ReportsListingComponent]
})
export class ReportModule {}
