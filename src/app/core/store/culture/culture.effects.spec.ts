import { CultureService } from './../../services/culture.service';
import {
  ReadCultureAction,
  ReadCultureSuccessAction,
  SwitchCultureAction,
  ReadAvailableCulturesAction,
  ReadAvailableCulturesSuccessAction,
  ResetCultureAction,
} from './culture.actions';
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
  let service: CultureService;
  let currentCulture: string;
  let availables: string[];
  let originalTimeout: number;
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ ...CultureReducers.reducer })],
      providers: [
        CultureEffects,
        CultureService,
        provideMockActions(() => actions),
      ],
    });
    currentCulture = 'en-US';
    availables = ['en-US', 'fr-CA'];
    store = TestBed.get(Store);
    service = TestBed.get(CultureService);
    spyOn(store, 'select').and.callFake(() => currentCulture);
    spyOn(service, 'setCurrentCulture').and.callFake((value) => {
      currentCulture = value;
      // console.log('Set currentCulture ' + currentCulture);
      return currentCulture;
    });

    spyOn(service, 'getCurrentCulture').and.callFake(() => {
      // console.log('Get currentCulture ' + currentCulture);
      return currentCulture;
    });

    spyOn(service, 'getAvailableCultures').and.callFake(() => {
      // console.log('Get available cultures ' + JSON.stringify(availables));
      return availables;
    });

    spyOn(service, 'resetCurrentCultureToDefault').and.callThrough();

    effects = TestBed.get(CultureEffects);
  });

  it('readAvailableCultures should return a stream with string read success action with available cultures', () => {
    const action = new ReadAvailableCulturesAction();
    const completion = new ReadAvailableCulturesSuccessAction({
      availableCultures: availables,
    });

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });

    expect(effects.readAvailableCultures$).toBeObservable(expected);
  });

  it('readCulture should return a stream with string read success action with currentCulture', () => {
    const action = new ReadCultureAction();
    const completion = new ReadCultureSuccessAction({
      cultureCode: currentCulture,
    });

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });

    expect(effects.readCulture$).toBeObservable(expected);
  });

  it('switch should return a stream with string read success action with new culture', (done) => {
    const action = new SwitchCultureAction({ cultureCode: 'fr-CA' });
    actions = hot('--a-', { a: action });
    const effect = effects.switchCulture$.subscribe(() => {
      const completion = new ReadCultureSuccessAction({
        cultureCode: currentCulture,
      });
      const expected = cold('--b', { b: completion });
      expect(effect).toBeObservable(expected);
      done();
    });
  });

  it('Reset should return a stream with string read success action Default', (done) => {
    const action = new ResetCultureAction();
    actions = hot('--a-', { a: action });
    const effect = effects.resetCulture$.subscribe(() => {
      const completion = new ReadCultureSuccessAction({
        cultureCode: currentCulture,
      });
      const expected = cold('--b', { b: completion });
      expect(effect).toBeObservable(expected);
      done();

    });
  });


  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
