import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CultureInterceptor } from './culture.interceptor';

@Injectable({
  providedIn: 'root'
})
export class DummyHttpService {
  constructor(private http: HttpClient) {}
  load(url: string) {
      return this.http.get(url).toPromise();
  }
}

describe(`CultureInterceptor`, () => {

  let service: DummyHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [

        DummyHttpService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CultureInterceptor,
          multi: true
        }
      ],
    });


    service = TestBed.get(DummyHttpService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should add culture to request header', () => {
    service.load('hello');
    const httpRequest = httpMock.expectOne('hello');
    expect(httpRequest.request.headers.has('Accept-Language')).toBe(true);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
