import { Router } from '@angular/router';
import { FetchApplicationDataSuccess, FetchApplicationPath } from './application.actions';
import { ApplicationEffects } from './application.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';


describe('Application Effects', () => {
  let effects: ApplicationEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // any modules needed
      ],
      providers: [
        ApplicationEffects,
        provideMockActions(() => actions),
        // other providers

      ],
    });

    effects = TestBed.get(ApplicationEffects);
  });

  it('should work', () => {
    const action = new FetchApplicationDataSuccess();
    const completion = new FetchApplicationPath();

    // Refer to 'Writing Marble Tests' for details on '--a-' syntax
    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });

    expect(effects.fetchApplicationDataSuccess$).toBeObservable(expected);
  });
});
