import { ApiResponse } from './../models/commons/api-response.model';
import { ContentVersion } from './../models/content/content-version';

import { Injectable } from '@angular/core';
import { ContentService } from './content.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DataPaginated } from '../models/commons/data-paginated.model';

describe('ContentService', () => {
  let injector: TestBed;
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContentService],
    });
    injector = getTestBed();
    service = injector.get(ContentService);
    httpMock = injector.get(HttpTestingController);
  });

  describe('getContentHistory', () => {
    it('should return an ContentVersion[]>', () => {
      const dummyHistory: ApiResponse<DataPaginated<ContentVersion>> = {
        success: true,
        data: {
          offset: 0,
          limit: 999,
          totalCount: 2,
          _links: [],
          items: [
            {
              authorFullName: 'fullName1',
              authorId: 1,
              creationDate: '2020-01-01',
              version: 1,
              value: 'value2',
            },
            {
              authorFullName: 'fullName2',
              authorId: 1,
              creationDate: '2020-01-02',
              version: 1,
              value: 'value2',
            },
          ],
        },
      };

      service.getContentVersionHistory(1, 1).subscribe((result) => {
        expect(result.data.items.length).toBe(2);
        expect(result).toEqual(dummyHistory);
      });
      const req = httpMock.expectOne(
        `application/${1}/content/${1}/history?replaceEmbeddedData=false`
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyHistory);
    });
  });
  describe('getContentVersion', () => {
    it('should return an ContentVersion with expected version number>', () => {
      const dummyContent: ApiResponse<ContentVersion> = {
        success: true,
        data: {

              authorFullName: 'fullName1',
              authorId: 1,
              creationDate: '2020-01-01',
              version: 1,
              value: 'value2',
        },
      };

      service.getContentVersion(1, 1, 1).subscribe((result) => {
        expect(result.data.version).toBe(1);
        expect(result).toEqual(dummyContent);
      });
      const req = httpMock.expectOne(
        `application/${1}/content/${1}/v/${1}?replaceEmbeddedData=false`
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyContent);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
