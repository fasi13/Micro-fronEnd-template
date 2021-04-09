import { ApiResponse } from './../models/commons/api-response.model';
import { HttpResponseLinksInterceptor } from './http-response.links.interceptors';
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

@Injectable({
  providedIn: 'root',
})
export class DummyHttpService {
  constructor(private http: HttpClient) {}
  getTest(url: string) {
    return this.http.get(url, { headers: { apiname: 'test.api' } });
  }
  getTest2(url: string) {
    return this.http.get(url, { headers: { apiname: 'test2.api' } });
  }
}

describe(`HttpResponseLinksInterceptor`, () => {
  let appConfigService: AppConfigService;
  let httpMock: HttpTestingController;
  let service: DummyHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppConfigService,
        DummyHttpService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpResponseLinksInterceptor,
          multi: true,
        },
      ],
    });

    appConfigService = TestBed.get(AppConfigService);
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(DummyHttpService);
    const dummyConfig: IAppConfig = {
      apis: [
        {
          name: 'test.api',
          routePatern: new RegExp('hello/|hi/|goodmorning/'),
          url: 'http://sayhi.com',
        },
        {
          name: 'test2.api',
          routePatern: new RegExp('seeyou/|bye/'),
          url: 'http://saygoodbye.com',
          AddLinks: {
            apiName: 'test.api',
            endPoint: 'links',
          },
        },
      ],
      services: []
    };

    spyOnProperty(appConfigService, 'config', 'get').and.returnValue(
      dummyConfig
    );
  });

  it('should not add the links  when the api not configured to addlink', (done) => {
    service.getTest('hello/papa').subscribe((results: ApiResponse<any>) => {
      expect(results).toBeTruthy();
      expect(results.data._links).toEqual([]);
    });
    httpMock.expectOne('hello/papa').flush({ data: { _links: [] } });
    done();
  });

  it('should call link api & add the links to the response when configured', (done) => {
    service.getTest2('bye/1').subscribe((results: ApiResponse<any>) => {
      expect(results).toBeTruthy();
      expect(results.data._links).toEqual([
        { url: 'OriginalUrl1' },
        { url: 'AddedUrl1' },
      ]);
    });
    httpMock
      .expectOne('bye/1')
      .flush({ data: { id: 1,  _links: [{ url: 'OriginalUrl1' }] } });
    httpMock
      .expectOne('http://sayhi.com/links/1')
      .flush({ data: { id: 1, _links: [{ url: 'AddedUrl1' }] } });
    done();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
