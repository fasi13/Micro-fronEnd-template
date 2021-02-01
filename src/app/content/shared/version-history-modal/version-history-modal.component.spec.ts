import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VersionHistoryModalComponent } from './version-history-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentModule } from '../../content.module';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State, TestInitialState } from 'src/app/core/store/store.reducers';
import { ContentService } from '@forge/core';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
describe('VersionHistoryModalComponent', () => {
  let fb: FormBuilder;
  let component: VersionHistoryModalComponent;
  let fixture: ComponentFixture<VersionHistoryModalComponent>;
  let store: MockStore<State>;
  let contentService: ContentService;
  const  initialState: State = TestInitialState;
  let history: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [
        NgbAccordionModule,
        HttpClientModule,
        ContentModule
      ],
      providers: [ ContentService, NgbActiveModal, provideMockStore({ initialState }) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    history = {data: { items: [{authorFullName: '1', version: 1, value : '1', creationDate: '2020-01-01'}],
      limit: 1,
      offset: 1,
      totalCount: 1,
      _links: []
    },
    success: true};

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(VersionHistoryModalComponent);
    component = fixture.componentInstance;
    fb = new FormBuilder();
    component.form = fb.group({test: 'test'});
    component.config = {name: 'test', type: ''};
    component.contentData = {id: 1, version: 1, name: '1', value: '1'};
    contentService = TestBed.get(ContentService);
    spyOn(contentService, 'getContentVersionHistory').and.callFake(() => of(history));
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  afterEach(() => {
    fixture.destroy();
  });
});
