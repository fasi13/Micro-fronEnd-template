import { State } from './../store.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ApplicationService } from './../../services/application.service';
import {
  SearchApplication,
  SearchApplicationSuccess,
  ApplicationActionTypes,
  FetchDataTypes,
} from './application.actions';
import { ApplicationEffects } from './application.effects';
import { RouterModule } from '@angular/router';
import { hot, cold } from 'jasmine-marbles';

import { Observable, of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import * as ApplicationReducers from './application.reducers';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FetchApplicationDataSuccess, FetchApplicationPath } from '.';
import { ApiResponse, DataPaginated, ApplicationPath } from '../../models';
import { FetchContentGroups } from '../content/content.actions';

fdescribe('application effects ', () => {
  let effects: ApplicationEffects;
  let actions: Observable<any>;
  let store: MockStore<State>;
  let originalTimeout: number;
  let service: ApplicationService;

  const  initialState: State = {
    authorization: {authenticated: null,
      loaded: false,
      loading: false,
      user: {applicationId: 1}},
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
    culture: {
      availableCultures: ['en-US'],
      currentCulture: 'en-US'
    },
    user: { users: {
      loading: false,
      items: null,
      error: null
    },
    user: {
      loading: false,
      data: {applicationId: 1},
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
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ ...ApplicationReducers.reducer }),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        ApplicationEffects,
        provideMockStore({ initialState }),
        RouterModule,
        provideMockActions(() => actions),
      ],
    });

    effects = TestBed.get(ApplicationEffects);
    store = TestBed.get(Store);
    service = TestBed.get(ApplicationService);
  });

  it('fetchApplicationDataSuccess should return a stream with action FetchAppPath', () => {
    const action = new FetchApplicationDataSuccess();
    actions = hot('--a', { a: action });
    const expected = cold('--(bcd)', { // the ( ) groups the values into the same timeframe
      b: new FetchApplicationPath(),
      c: new FetchContentGroups(),
      d: new FetchDataTypes()
    });

    expect(effects.fetchApplicationDataSuccess$).toBeObservable(expected);
  });

  it('[1][ok]search should return a stream with applicationPath result', () => {
    spyOn(service, 'search').and.returnValue(of({applicationId: 1}));

    const action = new SearchApplication();
    const completion = new SearchApplicationSuccess({applicationId: 1});

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });
    expect(effects.searchApplication$).toBeObservable(expected);
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
