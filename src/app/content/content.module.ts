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
import { ContentFormModalComponent } from './shared/content-form-modal/content-form-modal.component';
import { ContentEditorModalComponent } from './shared/content-editor-modal/content-editor-modal.component';
import { SharedModule } from '../shared/shared.module';
import { ContentEditorComponent } from './shared/content-editor/content-editor.component';
import { ContentInlineEditorComponent } from './shared/content-inline-editor/content-inline-editor.component';

const routes: Routes = [
  { path: '', redirectTo: 'groups' },
  {
    path: 'groups',
    component: GroupsListingComponent
  },
  {
    path: 'group/:groupId',
    component: GroupDetailsComponent
  },
  {
    path: 'group/:groupId/content/:contentId/edit',
    component: ContentEditorComponent
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
    GroupDetailsComponent,
    GroupsListingComponent,
    ContentTypeColorComponent,
    ContentTypeTextComponent,
    ContentTypeHtmlComponent,
    ContentTypeImageComponent,
    ContentTypeLogoComponent,
    ContentTypeDocumentComponent,
    GroupFormModalComponent,
    ContentFormModalComponent,
    ContentEditorModalComponent,
    ContentEditorComponent,
    ContentInlineEditorComponent
  ],
  entryComponents: [
    ContentFormModalComponent,
    ContentEditorModalComponent
  ]
})
export class ContentModule { }
