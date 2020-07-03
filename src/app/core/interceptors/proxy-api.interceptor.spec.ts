import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpRequest, HttpClient } from '@angular/common/http';
import { ProxyApiInterceptor } from './proxy-api.interceptor';
import { AppConfigService, IAppConfig } from 'src/app/app-config.service';
import { ContentService } from '../services';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DummyHttpService {
  constructor(private http: HttpClient) {}
  load(url: string) {
      return this.http.get(url).toPromise();
  }
}

describe(`ProxyApiInterceptor`, () => {
  let appConfigService: AppConfigService;
  let service: DummyHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppConfigService,
        DummyHttpService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ProxyApiInterceptor,
          multi: true
        }
      ],
    });

    appConfigService = TestBed.get(AppConfigService);
    service = TestBed.get(DummyHttpService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should not add api url', () => {
    spyOnProperty(appConfigService, 'config', 'get').and.returnValue({apiUrl:'http://goodjob.com'});
    service.load('app-config.json');
    httpMock.expectOne('app-config.json');
  });

  it('should add api url', () => {
    spyOnProperty(appConfigService, 'config', 'get').and.returnValue({apiUrl:'http://goodjob.com'});
    service.load('hello');
    httpMock.expectOne('http://goodjob.com/hello');
  });
});
