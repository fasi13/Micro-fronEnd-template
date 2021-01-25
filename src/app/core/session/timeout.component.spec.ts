import { TimeoutService } from './../services/timeout.service';
import { TestBed } from '@angular/core/testing';
import { TimeoutComponent } from '../session/timeout.component';
import { User } from '../models';
import { FgeModalService } from '../services';
import { State } from 'src/app/core/store/store.reducers';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';

describe('TimeoutComponent', () => {
  let timeoutService: TimeoutService;
  let timeoutComponent: TimeoutComponent;
  let modalService: FgeModalService;
  let store: MockStore<State>;
  const user: User = { authenticationTokenLifespanMinutes: 1, applicationId: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TimeoutComponent],
      providers: [TimeoutService, TimeoutComponent, FgeModalService, provideMockStore()],
    });

    timeoutService = TestBed.get(TimeoutService);
    timeoutComponent = TestBed.get(TimeoutComponent);
    modalService = TestBed.get(FgeModalService);
    store = TestBed.get(Store);

    timeoutService.user = user;
    timeoutComponent.dialogReference = undefined;

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('resetSessionTimeout', () => {
    it('should open timeout dialog', () => {
      timeoutComponent.resetSessionTimeout(1, timeoutComponent);

      setTimeout(() => {
        expect(timeoutComponent.dialogReference).toBeDefined();
      });
    });
  });

  describe('stay', () => {
    it('should call extendSession on timeoutService', () => {
      spyOn(timeoutService, 'extendSession').and.callThrough();

      timeoutComponent.resetSessionTimeout(1, timeoutComponent);

      setTimeout(() => {
        timeoutComponent.stay();
        expect(timeoutService.extendSession).toHaveBeenCalled();
      });
    });
  });

   describe('logout', () => {
    it('should call logout on timeoutService', () => {
      spyOn(timeoutService, 'logout').and.callThrough();

      timeoutComponent.resetSessionTimeout(1, timeoutComponent);

      setTimeout(() => {
        timeoutComponent.logout();
        expect(timeoutService.logout).toHaveBeenCalled();
      });
    });
  });
});
