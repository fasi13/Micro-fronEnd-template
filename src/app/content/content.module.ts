import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GroupsListingComponent } from './groups-listing/groups-listing.component';
import { GroupDetailsComponent } from './group-details/group-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'groups' },
  {
    path: 'groups',
    component: GroupsListingComponent
  },
  {
    path: 'group/:id',
    component: GroupDetailsComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    GroupDetailsComponent,
    GroupsListingComponent
  ]
})
export class ContentModule { }
