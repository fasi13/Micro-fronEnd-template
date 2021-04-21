import { State, TestInitialState } from '../store.reducers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  TransactionContentRecord,
  TransactionContentRecordCompleted,
} from './content.actions';
import { ContentEffects } from './content.effects';
import { RouterModule } from '@angular/router';
import { hot, cold } from 'jasmine-marbles';

import { Observable, of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import * as ContentReducers from './content.reducers';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContentService } from '@forge/core';

describe('content effects ', () => {
  let effects: ContentEffects;
  let actions: Observable<any>;
  let store: MockStore<State>;
  let originalTimeout: number;
  let service: ContentService;

  const  initialState: State = TestInitialState;
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ ...ContentReducers.reducer }),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        ContentEffects,
        provideMockStore({ initialState }),
        RouterModule,
        provideMockActions(() => actions),
      ],
    });

    effects = TestBed.get(ContentEffects);
    store = TestBed.get(Store);
    service = TestBed.get(ContentService);
  });

  fit('TransactionContentRecord should call TransactionContentRecordCompleted', () => {
    spyOn(service, 'addContentToGroup').and.returnValue(of({}));
    let payload = {};
    const action = new TransactionContentRecord(payload);
    const completion = new TransactionContentRecordCompleted({});
    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });
    expect(effects.addContent).toBeObservable(expected);
  });
});
