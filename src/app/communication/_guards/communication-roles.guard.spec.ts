import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { State, TestInitialState } from '@forge/core';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { CommunicationRolesGuard } from './communication-roles.guard';

describe('CommunicationRolesGuard', () => {
  let guard: CommunicationRolesGuard;
  let store: Store<State>;
  const initialState: State = TestInitialState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      declarations: [],
      imports: [],
      schemas: []
    });
    store = TestBed.get(Store);
    guard = new CommunicationRolesGuard(store);
  });

  it('should be created', (done) => {
    expect(guard).toBeTruthy();
    done();
  });

  it('should be able to active', (done) => {
    guard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });
});
