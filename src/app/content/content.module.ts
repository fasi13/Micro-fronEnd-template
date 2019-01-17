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
import { ContentInlineEditorComponent } from './shared/content-inline-editor/content-inline-editor.component';
import { ContentHtmlEditorComponent } from './content-html-editor/content-html-editor.component';
import { GroupNotFoundComponent } from './content-error-pages/group-not-found/group-not-found.component';
import { GroupsListingGuard } from './_guards/groups-listing.guard';
import { GroupDetailsGuard } from './_guards/group-details.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'groups'
  },
  {
    path: 'groups',
    canActivate: [ GroupsListingGuard ],
    component: GroupsListingComponent
  },
  {
    path: 'group/:groupId',
    canActivate: [ GroupDetailsGuard ],
    component: GroupDetailsComponent
  },
  {
    path: 'group/:groupId/content/:contentId/edit',
    component: ContentHtmlEditorComponent
  },
  {
    path: 'notFound',
    component: GroupNotFoundComponent
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
    ContentHtmlEditorComponent,
    ContentInlineEditorComponent,
    GroupNotFoundComponent
  ],
  entryComponents: [
    ContentFormModalComponent,
    ContentEditorModalComponent
  ]
})
export class ContentModule { }
