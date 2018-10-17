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
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupFormModalComponent } from './shared/group-form-modal/group-form-modal.component';

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
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    NgBootstrapModule,
    ReactiveFormsModule
  ],
  declarations: [
    GroupDetailsComponent,
    GroupsListingComponent,
    ContentTypeColorComponent,
    ContentTypeTextComponent,
    ContentTypeHtmlComponent,
    ContentTypeImageComponent,
    ContentTypeLogoComponent,
    ContentTypeDocumentComponent,
    GroupFormModalComponent
  ]
})
export class ContentModule { }
