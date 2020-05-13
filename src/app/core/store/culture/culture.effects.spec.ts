import { ReadCultureAction, ReadCultureSuccessAction } from './culture.actions';
import { CultureEffects } from './culture.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import * as CultureReducers from './culture.reducers';


describe('CultureEffects', () => {
  let effects: CultureEffects;
  let actions: Observable<any>;
  let store: Store<any>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({...CultureReducers.reducer})
      ],
      providers: [
        CultureEffects,
        provideMockActions(() => actions),

      ],
    });
    store = TestBed.get(Store);
    spyOn(store, 'select').and.returnValue('en-US');
    effects = TestBed.get(CultureEffects);
  });

  it('should return a stream with string read success action', () => {
    const action = new ReadCultureAction();
    const completion = new ReadCultureSuccessAction({ cultureCode: 'en-US' });

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });

    expect(effects.readCulture$).toBeObservable(expected);
  });
});
