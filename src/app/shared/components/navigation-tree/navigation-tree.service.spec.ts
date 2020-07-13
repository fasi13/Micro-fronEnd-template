
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';


import { NavigationTreeService } from './navigation-tree.service';
import { ApiResponse, DataPaginated } from '@forge/core';

describe('Navigation Tree Service', () => {
  let injector: TestBed;
  let service: NavigationTreeService;
  let httpMock: HttpTestingController;
  const dummyApplications: ApiResponse<DataPaginated<any>> = {
    success: true,
    data: {
     items: ['application One', 'Application Two'],
      _links: [],
      limit: 10,
      offset: 0,
      totalCount: 2
    },
  };

  const dummyApplicationGroups: ApiResponse<DataPaginated<any>> = {
    success: true,
    data: {
     items: ['group One', 'group Two'],
      _links: [],
      limit: 10,
      offset: 0,
      totalCount: 2
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NavigationTreeService],
    });
    injector = getTestBed();
    service = injector.get(NavigationTreeService);
    httpMock = injector.get(HttpTestingController);
  });

  describe('getApplications', () => {
    it('should return a list of applications', () => {

      service.getApplications(1, 1).subscribe((result) => {
        expect(result.data.items.length).toBe(2);
        expect(result.data.items[0]).toBe('application One');
      });
      const req = httpMock.expectOne(`applications/${1}/applicationGroup/${1}/applications`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyApplications);
    });
  });

  describe('getApplicationGroups', () => {
    it('should return a list of application groups', () => {

      service.getApplicationGroups(1).subscribe((result) => {
        expect(result.data.items.length).toBe(2);
        expect(result.data.items[0]).toBe('group One');
      });
      const req = httpMock.expectOne(`applications/${1}/applicationGroups`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyApplicationGroups);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
