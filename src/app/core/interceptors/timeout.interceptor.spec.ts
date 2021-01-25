import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { AppConfigService, IAppConfig } from 'src/app/app-config.service';
import { Injectable } from '@angular/core';
import { TimeoutInterceptor } from './timeout.interceptor';
import { TimeoutService } from '../services/timeout.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from 'src/app/core/store/store.reducers';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class DummyHttpService {
  constructor(private http: HttpClient) {}
  load(url: string) {
    return this.http.get(url).toPromise();
  }
}

describe(`TimeoutInterceptor`, () => {
  let appConfigService: AppConfigService;
  let service: DummyHttpService;
  let httpMock: HttpTestingController;
  let timeoutService: TimeoutService;
  let store: MockStore<State>;
  const initialState: State = {
    authorization: { authenticated: null, loaded: false, loading: false },
    router: { state: null, navigationId: null },
    application: {
      current: {
        info: null,
        branding: null,
        loading: false,
      },
      search: {
        data: null,
        loading: false,
      },
      types: {
        data: null,
        loading: false,
      },
      path: {
        data: null,
        loading: false,
      },
      preview: {
        branding: null,
        loading: false,
      },
    },
    content: {
      groups: {
        loading: false,
        items: null,
      },
      group: {
        loading: false,
        data: null,
      },
      content: {
        loading: false,
        data: null,
      },
      record: {
        loading: false,
        error: null,
      },
      action: {
        loading: false,
        error: null,
      },
      contentGroup: {
        loading: false,
        error: null,
      },
    },
    report: {
      audit: {
        loading: false,
        items: null,
        filters: null,
        sort: null,
      },
    },
    resetPassword: {
      resetPassword: {
        loading: false,
        error: null,
      },
    },
    culture: {
      availableCultures: ['en-US'],
      currentCulture: 'en-US'
    },
    user: {
      users: {
        loading: false,
        items: null,
        error: null,
      },
      user: {
        loading: false,
        data: null,
        error: null,
      },
      roles: {
        loading: false,
        items: null,
        error: null,
        selected: {
          loading: true,
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppConfigService,
        DummyHttpService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TimeoutInterceptor,
          multi: true,
        },
        provideMockStore({initialState})
      ],
    });

    appConfigService = TestBed.get(AppConfigService);
    timeoutService = TestBed.get(TimeoutService);
    service = TestBed.get(DummyHttpService);
    httpMock = TestBed.get(HttpTestingController);
    store = TestBed.get(Store);
    const dummyConfig: IAppConfig = {
      apis: [
        {
          name: 'test1.api',
          routePatern: new RegExp('application\/|user\/'),
          url: 'http://cms.test.com',
        },
        {
          name: 'test2.api',
          routePatern: new RegExp('hello\/'),
          url: 'http://hyrc.test.com',
        }
      ],
      services: []
    };

    spyOnProperty(appConfigService, 'config', 'get').and.returnValue(
      dummyConfig
    );
    spyOn(timeoutService, 'requestReceived').and.callThrough();
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should not call requestReceived', () => {
    service.load('http://hyrc.test.com/hello/papa');
    httpMock.expectOne('http://hyrc.test.com/hello/papa');
    expect(timeoutService.requestReceived).toHaveBeenCalledTimes(0);
  });

  it('should call requestReceived', () => {
    service.load('http://cms.test.com/application/groups');
    httpMock.expectOne('http://cms.test.com/application/groups');
    expect(timeoutService.requestReceived).toHaveBeenCalled();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
