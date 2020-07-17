import { ApplicationService } from './../../services/application.service';
import {
  SearchApplication,
  SearchApplicationSuccess,
  ApplicationActionTypes,
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

describe('application effects ', () => {
  let effects: ApplicationEffects;
  let actions: Observable<any>;
  let store: Store<any>;
  let originalTimeout: number;
  let service: ApplicationService;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ ...ApplicationReducers.reducer }),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        ApplicationEffects,

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
    const completion = new FetchApplicationPath();

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });
    expected.subscribe((data) => {
      expect(data.type).toBe(ApplicationActionTypes.FETCH_APPLICATION_PATH);
    });
  });

  it('search should return a stream with applicationPath result', () => {
    spyOn(service, 'search').and.callFake(() => {});
    const action = new SearchApplication();
    const completion = new SearchApplicationSuccess();

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });
    expected.subscribe((data) => {
      expect(data.type).toBe(ApplicationActionTypes.SEARCH_APPLICATION_SUCCESS);
    });
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
