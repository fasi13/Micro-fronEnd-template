import { TimeoutService } from './timeout.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule, HttpTestingController,
} from '@angular/common/http/testing';
import { ApplicationService } from './application.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from 'src/app/core/store/store.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

describe('TimeoutService', () => {
  let injector: TestBed;
  let timeoutService: TimeoutService;
  let applicationService: ApplicationService;
  let store: MockStore<State>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimeoutService, ApplicationService, provideMockStore()],
    });

    injector = getTestBed();
    httpMock = TestBed.get(HttpTestingController);
    timeoutService = injector.get(TimeoutService);
    applicationService = injector.get(ApplicationService);
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('extendSession', () => {
    it('should call get applicationInfo in ApplicationService', () => {
      spyOn(applicationService, 'getApplicationInfo').and.returnValue(new Observable());
      timeoutService.user = { applicationId: '1' };

      timeoutService.extendSession();

      expect(applicationService.getApplicationInfo).toHaveBeenCalled();
      httpMock.verify();
    });
  });
});
