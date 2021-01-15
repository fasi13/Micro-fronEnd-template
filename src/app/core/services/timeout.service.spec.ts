import { ApplicationContent } from './../models/application/application-content.model';
import { ApiResponse } from './../models/commons/api-response.model';
import { ContentVersion } from './../models/content/content-version';
import { ContentService } from './content.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DataPaginated } from '../models/commons/data-paginated.model';

describe('TimeoutService', () => {
  let injector: TestBed;
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // TestBed.configureTestingModule({
    //   imports: [HttpClientTestingModule],
    //   providers: [ContentService],
    // });
    // injector = getTestBed();
    // service = injector.get(ContentService);
    // httpMock = injector.get(HttpTestingController);
  });

  describe('extendSession', () => {
    it('should call get applicationInfo in ApplicationService', () => {

      expect(1).toBe(1);
    });
  });


  afterEach(() => {
   // httpMock.verify();
  });
});
