import { ApplicationContent } from './../../core/models/application/application-content.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { GroupDetailsComponent } from './group-details.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { State, TestInitialState } from 'src/app/core/store/store.reducers';
import { FgeModalService } from '@forge/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupNotFoundComponent } from '../content-error-pages/group-not-found/group-not-found.component';
import { ContentHtmlEditorComponent } from '../content-html-editor/content-html-editor.component';
import { GroupsListingComponent } from '../groups-listing/groups-listing.component';
import { ContentEditorModalComponent } from '../shared/content-editor-modal/content-editor-modal.component';
import { ContentFormModalComponent } from '../shared/content-form-modal/content-form-modal.component';
import {
  ShowLinkPipe,
} from '../shared/content-inline-editor/content-inline-editor.component';
import {
  ContentTypeColorComponent,
  ContentTypeTextComponent,
  ContentTypeHtmlComponent,
  ContentTypeImageComponent,
  ContentTypeLogoComponent,
  ContentTypeDocumentComponent,
} from '../shared/content-types';
import { GroupFormModalComponent } from '../shared/group-form-modal/group-form-modal.component';
import { of } from 'rxjs';

export class MockNgbModalRef {
  constructor(private content: ApplicationContent) {}
  componentInstance = {
    groupId: undefined,
    group: undefined,
  };
  result: Promise<ApplicationContent> = new Promise((resolve, reject) =>
    resolve(this.content)
  );
}

@Component({ template: '' })
export class ContentInlineEditorComponent {}


describe('GroupDetailsComponent', () => {
  let fixture: ComponentFixture<GroupDetailsComponent>;
  let component: GroupDetailsComponent;
  let store: MockStore<State>;
  let fgeModalService: FgeModalService;
  let modalService: NgbModal;
  const initialState: State = TestInitialState;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), FgeModalService],
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
        ShowLinkPipe,
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
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(GroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fgeModalService = TestBed.get(FgeModalService);
    modalService = TestBed.get(NgbModal);
    component.currentGroup = { id: 0, name: '', _links: [], content: null };
    component.listContents = [
      { dataType: { name: 'Document', type: '' }, name: 'name5', version: 0 },
    ];
    component.editableContents = [
      { contentData: { dataType: { name: 'Document', type: '' }, name: 'name5', version: 0 } }
    ];
    spyOn(fgeModalService, 'registerModal').and.callFake(() => {});
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  const testCases = [
    {ex: 'lower datatype', displayAsList: true, name: 'name5', dataTypeName: 'Color Picker', expectPosition: 0 },
    {ex: 'upper datatype', displayAsList: true,  name: 'name1', dataTypeName: 'Image', expectPosition: 1 },
    {ex: 'same datatype & lower name', displayAsList: true, name: 'name4', dataTypeName: 'Document', expectPosition: 0 },
    {ex: 'same datatype & upper name', displayAsList: true,  name: 'name6', dataTypeName: 'Document', expectPosition: 1 },

    {ex: 'lower datatype', displayAsList: false, name: 'name5', dataTypeName: 'Color Picker', expectPosition: 0 },
    {ex: 'upper datatype', displayAsList: false,  name: 'name1', dataTypeName: 'Image', expectPosition: 1 },
    {ex: 'same datatype & lower name', displayAsList: false, name: 'name4', dataTypeName: 'Document', expectPosition: 0 },
    {ex: 'same datatype & upper name', displayAsList: false,  name: 'name6', dataTypeName: 'Document', expectPosition: 1 },


  ];
  testCases.forEach((testCase) => {
    it(`when new ${testCase.displayAsList ? 'list' : 'no list'} content is ${testCase.ex} should add to list in position ${testCase.expectPosition}` , (done) => {
      const content = {
        displayAsList: testCase.displayAsList,
        dataType: { name: testCase.dataTypeName, type: '' },
        name: testCase.name,
        version: 0,
      };

      const mockModalRef = new MockNgbModalRef( content);
      spyOn(modalService, 'open').and.returnValue(mockModalRef);

      component.openContentForm().then(() => {
        if (testCase.displayAsList) {
          expect(component.listContents.length).toBe(2);
          const position = component.listContents.indexOf(content);
          expect(position).toBe(testCase.expectPosition);
        }
        else {
          expect(component.editableContents.length).toBe(2);
        }
        done();
      });
    });
  });

  fit('init selector, no content group', fakeAsync(() => {
    component.ready = false;
    let group = null;
    spyOn(store, 'select').and.returnValue(of(group));
    component.initSelectors();
    flushMicrotasks();
    tick(200);
    fixture.detectChanges();
    expect(component.ready).toBe(false);
  }));

  fit('init selector, with content group', fakeAsync(() => {
    component.ready = false;
    let group = {
        _links:[],
        content: [
          {displayAsList: true,  name: 'name6', dataType: { name: 'text' } },
          {displayAsList: false, name: 'name5', dataType: { name: 'text' } },
        ],
        id: 1,
        name: ''
    };
    spyOn(store, 'select').and.returnValue(of(group));
    component.initSelectors();
    flushMicrotasks();
    tick(200);
    fixture.detectChanges();
    expect(component.ready).toBe(true);
  }));

  afterEach(() => {
    fixture.destroy();
  });
});
