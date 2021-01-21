import { TimeoutService } from './timeout.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule, HttpTestingController,
} from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from 'src/app/core/store/store.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TimeoutComponent } from '../session/timeout.component';
import { User } from '../models';
import { LogoutAction, ResetCultureAction } from '@forge/core-store';
import { ContentService } from './content.service';

describe('TimeoutService', () => {
  let injector: TestBed;
  let timeoutService: TimeoutService;
  let contentService: ContentService;
  let store: MockStore<State>;
  let httpMock: HttpTestingController;
  let timeoutComponent: TimeoutComponent;
  const user: User = { authenticationTokenLifespanMinutes: 1, applicationId: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimeoutService, ContentService, provideMockStore()],
    });

    injector = getTestBed();
    httpMock = TestBed.get(HttpTestingController);
    timeoutService = injector.get(TimeoutService);
    contentService = injector.get(ContentService);
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();

    timeoutComponent = new TimeoutComponent(null, timeoutService);
    timeoutComponent.resetSessionTimeout = () => { };
    spyOn(timeoutComponent, 'resetSessionTimeout').and.callThrough();
  });

  describe('extendSession', () => {
    it('should call get applicationInfo in ApplicationService', () => {
      spyOn(contentService, 'getContentGroups').and.returnValue(new Observable());
      timeoutService.user = user;

      timeoutService.extendSession();

      expect(contentService.getContentGroups).toHaveBeenCalled();
      httpMock.verify();
    });
  });

  describe('requestReceived', () => {
    it('should call resetSessionTimeout in TimeoutOmponent if user and component available', () => {
      timeoutService.user = user;
      timeoutService.timeoutComponent = timeoutComponent;

      timeoutService.requestReceived();

      expect(timeoutComponent.resetSessionTimeout).toHaveBeenCalled();
    });

    it('should not call resetSessionTimeout in TimeoutOmponent if user not available', () => {
      timeoutService.timeoutComponent = timeoutComponent;
      timeoutService.user = undefined;

      timeoutService.requestReceived();

      expect(timeoutComponent.resetSessionTimeout).toHaveBeenCalledTimes(0);
    });

    it('should not call resetSessionTimeout in TimeoutOmponent if component not available', () => {
      timeoutService.user = user;
      timeoutService.timeoutComponent = undefined;

      timeoutService.requestReceived();

      expect(timeoutComponent.resetSessionTimeout).toHaveBeenCalledTimes(0);
    });
  });

  describe('logout', () => {
    it('should dispatch actions to store to logout the user', () => {
      timeoutService.logout();

      expect(store.dispatch).toHaveBeenCalledWith(new ResetCultureAction());
      expect(store.dispatch).toHaveBeenCalledWith(new LogoutAction(new Event('click').type));
    });
  });

  afterEach(() => {
  });
});
