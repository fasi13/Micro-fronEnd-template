import { ContentActionTypes, FetchContent } from './../../core/store/content/content.actions';
import { CoreModule } from './../../core/core.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { ContentHtmlEditorComponent } from './content-html-editor.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { State } from 'src/app/core/store/store.reducers';



describe('ContentHtmlEditorComponent', () => {
  let fixture: ComponentFixture<ContentHtmlEditorComponent>;
  let component: ContentHtmlEditorComponent;
  let store: MockStore<State>;
  const  initialState: State = {
  authorization: {authenticated: null,
    loaded: false,
    loading: false},
  router: {state: null, navigationId: null},
  application: { current: {
    info: null,
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideMockStore({ initialState })],
      declarations: [ContentHtmlEditorComponent],
      imports: [
        NotifierModule,
        HttpClientModule,
        CoreModule,
        CommonModule,
        SharedModule,
        NgBootstrapModule,
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
      ],
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(ContentHtmlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should dispatch an action to load data when created', () => {

    expect(store.dispatch).toHaveBeenCalledWith(new FetchContent({ applicationId: undefined, contentId: undefined }));


    store.scannedActions$.subscribe((a: Action) => expect(
      [
        '@ngrx/store/init',
        ContentActionTypes.FETCH_CONTENT,
        ContentActionTypes.FETCH_CONTENT_COMPLETED,
      ].includes(a.type)).toBeTruthy());
    });

});


