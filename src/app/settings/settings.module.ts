import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GroupsListingComponent } from './groups-listing/groups-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'groups'
  },
  {
    path: 'groups',
    component: GroupsListingComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapModule,
    SharedModule
  ],
  declarations: [
    GroupsListingComponent
  ]
})
export class SettingsModule { }
