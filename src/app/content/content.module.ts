import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GroupsListingComponent } from './groups-listing/groups-listing.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { 
  ContentTypeColorComponent,
  ContentTypeTextComponent,
  ContentTypeHtmlComponent,
  ContentTypeImageComponent,
  ContentTypeLogoComponent,
  ContentTypeDocumentComponent
} from './shared/content-types';

const routes: Routes = [
  { path: '', redirectTo: 'groups' },
  {
    path: 'groups',
    component: GroupsListingComponent
  },
  {
    path: 'group/:groupId',
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
    GroupsListingComponent,
    ContentTypeColorComponent,
    ContentTypeTextComponent,
    ContentTypeHtmlComponent,
    ContentTypeImageComponent,
    ContentTypeLogoComponent,
    ContentTypeDocumentComponent
  ]
})
export class ContentModule { }
