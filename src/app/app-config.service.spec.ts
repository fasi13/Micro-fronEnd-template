import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  AppConfigService,
  IAppConfig,
  initializeApp,
} from './app-config.service';
import { HttpRequest } from '@angular/common/http';

describe('AppConfigService', () => {
  let injector: TestBed;
  let service: AppConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppConfigService],
    });
    injector = getTestBed();
    service = injector.get(AppConfigService);
    httpMock = injector.get(HttpTestingController);
  });

  it('config should return a given config', (done) => {
    const dummyConfig: IAppConfig = {
      apis: [
        {
          name: 'test.api',
          routePatern: new RegExp('endPoint/|galileo/'),
          url: 'url1',
        },
        {
          name: 'testLinks.api',
          routePatern: new RegExp('links/'),
          url: 'http://linksApi.com',
        },
      ],
    };

    service.load().then(() => {
      expect(service.config).toBeTruthy();
      done();
    });
    const req = httpMock.expectOne(
      (request: HttpRequest<any>) =>
        request.url.indexOf('assets/config/app-config.json?v=') !== -1
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyConfig);
  });

  it('when error loading json config should raise an error', (done) => {
    service.load().then(
      () => {
        // nothing should be done here
      },
      (reason) => {
        expect(reason).toBe('Failed to load the app-config.json file');
        done();
      }
    );
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    const data = 'Invalid request parameters';
    const req = httpMock.expectOne(
      (request: HttpRequest<any>) =>
        request.url.indexOf('assets/config/app-config.json?v=') !== -1
    );
    req.flush(data, mockErrorResponse);
  });

  it('initializeApp should setup the app config', (done) => {
    const dummyConfig: IAppConfig = {
      apis: [
        {
          name: 'test.api',
          routePatern: new RegExp('endPoint/|galileo/'),
          url: 'url1',
        },
      ],
    };
    initializeApp(service)().then(() => {
      expect(service.config).toBeTruthy();
      done();
    });
    const req = httpMock.expectOne(
      (request: HttpRequest<any>) =>
        request.url.indexOf('assets/config/app-config.json?v=') !== -1
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyConfig);
  });

  it('GetApi should return null when the config is not loaded', (done) => {
    expect(service.getApiByName('apiName')).toBeNull();
    expect(service.getApiByRoute('route')).toBeNull();
    done();
  });

  it('GetApi sound return api', (done) => {
    const dummyConfig: IAppConfig = {
      apis: [
        {
          name: 'test.api',
          routePatern: new RegExp('endPoint/|galileo/'),
          url: 'url1',
        },
        {
          name: 'testLinks.api',
          routePatern: new RegExp('links/'),
          url: 'http://linksApi.com',
        },
      ],
    };

    spyOnProperty(service, 'config', 'get').and.returnValue(dummyConfig);
    expect(service.getApiByName('test.api')).toBe(dummyConfig.apis[0]);
    expect(service.getApiByRoute('galileo/letmego')).toBe(dummyConfig.apis[0]);
    done();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
