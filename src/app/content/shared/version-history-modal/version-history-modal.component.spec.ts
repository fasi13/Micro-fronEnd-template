import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VersionHistoryModalComponent } from './version-history-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentModule } from '../../content.module';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from 'src/app/core/store/store.reducers';
import { ContentService } from '@forge/core';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
describe('VersionHistoryModalComponent', () => {
  let fb: FormBuilder;
  let component: VersionHistoryModalComponent;
  let fixture: ComponentFixture<VersionHistoryModalComponent>;
  let store: MockStore<State>;
  let contentService: ContentService;
  const  initialState: State = {
  authorization: {authenticated: null,
    loaded: false,
    loading: false},
  router: {state: null, navigationId: null},
  application: { current: {
    info: {  id: 1,
      name: '1',
      value: '1',
      _links: []
    },
    branding: null,
    loading: false,
  },
  search: {
    data: null,
    loading: false
  },
  types: {
    data: null,
    loading: false
  },
  path: {
    data: null,
    loading: false
  },
  preview: {
    branding: null,
    loading: false
  }},
  content: { groups: {
    loading: false,
    items: null
  },
  group: {
    loading: false,
    data: null
  },
  content: {
    loading: false,
    data: null
  },
  record: {
    loading: false,
    error: null
  },
  action: {
    loading: false,
    error: null
  },
  contentGroup: {
    loading: false,
    error: null
  }},
  report: {audit: {
    loading: false,
    items: null,
    filters: null,
    sort: null
  }},
  resetPassword: { resetPassword: {
    loading: false,
    error: null
  }},
  user: { users: {
    loading: false,
    items: null,
    error: null
  },
  user: {
    loading: false,
    data: null,
    error: null
  },
  roles: {
    loading: false,
    items: null,
    error: null,
    selected: {
      loading: true
    }
  }},

  };
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
    history = {data: { items: [{authorFullName: '1', version: 1, value : '1', creationDate: 'test'}],
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
