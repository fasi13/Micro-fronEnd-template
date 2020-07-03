import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfigService, IAppConfig, initializeApp } from './app-config.service';
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

  it('config should return a given config', () => {
    const dummyConfig: IAppConfig = {
      apiUrl: 'url1'
    };
    service.load().then((result) => {
      expect(service.config.apiUrl).toBe('url1');
    });
    const req = httpMock.expectOne((request: HttpRequest<any>) => request.url.indexOf('assets/config/app-config.json?v=') !== -1);
    expect(req.request.method).toBe('GET');
    req.flush(dummyConfig);
  });

  it('initializeApp should setup the app config', () => {
    const dummyConfig: IAppConfig = {
      apiUrl: 'url1'
    };
    initializeApp(service)().then((result) => {
      expect(service.config.apiUrl).toBe('url1');
    });
    const req = httpMock.expectOne((request: HttpRequest<any>) => request.url.indexOf('assets/config/app-config.json?v=') !== -1);
    expect(req.request.method).toBe('GET');
    req.flush(dummyConfig);
  });


  afterEach(() => {
    httpMock.verify();
  });
});
