import { HttpResponseLinksInterceptor } from './http-response.links.interceptors';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';

import { AppConfigService, IAppConfig } from 'src/app/app-config.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DummyHttpService {
  constructor(private http: HttpClient) {}
  get(url: string) {
    return this.http.get(url);
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
            _links: [
              {
                rel: 'rel',
                name: 'addedLink',
                href: 'http://href',
                method: { method: 'GET' },
              },
            ],
            paramName: '',
          },
        },
      ],
    };

    spyOn(appConfigService, 'getApiByName')
      .and.callFake(() => {})
      .and.returnValue(dummyConfig.apis[1]);
  });

  // it('should not add the links', (done) => {
  //   service.get('hello').subscribe((results) => {
  //     expect(results).toBeTruthy();
  //    // expect(results.body.data._links).toEqual([]);
  //   });
  //   httpMock.expectOne('hello').flush({});
  //   done();
  // });

  afterEach(() => {
    httpMock.verify();
  });
});
