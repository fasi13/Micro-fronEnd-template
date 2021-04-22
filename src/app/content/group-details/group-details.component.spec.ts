import { CoreModule } from '../../core/core.module';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { GroupDetailsComponent } from './group-details.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { State, TestInitialState } from 'src/app/core/store/store.reducers';
import { FgeModalService } from '@forge/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupNotFoundComponent } from '../content-error-pages/group-not-found/group-not-found.component';
import { ContentHtmlEditorComponent } from '../content-html-editor/content-html-editor.component';
import { GroupsListingComponent } from '../groups-listing/groups-listing.component';
import { ContentEditorModalComponent } from '../shared/content-editor-modal/content-editor-modal.component';
import { ContentFormModalComponent } from '../shared/content-form-modal/content-form-modal.component';
import { ContentInlineEditorComponent, ShowLinkPipe } from '../shared/content-inline-editor/content-inline-editor.component';
import { ContentTypeColorComponent, ContentTypeTextComponent, ContentTypeHtmlComponent, ContentTypeImageComponent, ContentTypeLogoComponent, ContentTypeDocumentComponent } from '../shared/content-types';
import { GroupFormModalComponent } from '../shared/group-form-modal/group-form-modal.component';

describe('GroupDetailsComponent', () => {
  let fixture: ComponentFixture<GroupDetailsComponent>;
  let component: GroupDetailsComponent;
  let store: MockStore<State>;
  let modalService: FgeModalService;
  const  initialState: State = TestInitialState;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideMockStore({ initialState }), FgeModalService],
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
        GroupNotFoundComponent,
        ShowLinkPipe
      ],
      imports: [
        NotifierModule,
        HttpClientModule,
        CoreModule,
        CommonModule,
        SharedModule,
        NgBootstrapModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(GroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalService = TestBed.get(FgeModalService);
  });

  fit('should be created', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});


