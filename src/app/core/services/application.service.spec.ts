import { ApplicationService } from './application.service';
import { ApiResponse } from './../models/commons/api-response.model';

import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  Application,
  ApplicationPath,
  DataPaginated,
  DataType,
} from '../models';

describe('Application Service', () => {
  let injector: TestBed;
  let service: ApplicationService;
  let httpMock: HttpTestingController;
  const dummyApplication: ApiResponse<Application> = {
    success: true,
    data: {
      id: 1,
      name: 'application One',
      value: null,

      _links: [],
    },
  };
  const dummyApplicationPath: ApiResponse<ApplicationPath> = {
    success: true,
    data: {
      path: [dummyApplication.data],
      _links: [],
    },
  };

  const dummyApplicationDataTypes: ApiResponse<DataPaginated<DataType>> = {
    success: true,
    data: {
      items: [{ name: 'datatype One', type: null, _links: null, values: null }],
      limit: 10,
      offset: 0,
      totalCount: 2,
      _links: [],
    },
  };

  const dummyApplicationPaths: ApiResponse<DataPaginated<ApplicationPath>> = {
    success: true,
    data: {
      items: [
        {
          path: [{ name: 'application One', _links: [], id: 1, value: 'app1' }],
          _links: [],
        },
      ],
      limit: 10,
      offset: 0,
      totalCount: 2,
      _links: [],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicationService],
    });
    injector = getTestBed();
    service = injector.get(ApplicationService);
    httpMock = injector.get(HttpTestingController);
  });

  describe('getApplicationInfo', () => {
    it('should return an application info>', () => {
      service.getApplicationInfo(1).subscribe((result) => {
        expect(result.data.name).toBe('application One');
        expect(result).toBe(dummyApplication);
      });
      const req = httpMock.expectOne(`applications/${1}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyApplication);
    });
  });

  describe('getApplicationPath', () => {
    it('should return an application Path>', () => {
      service.getApplicationPath(1).subscribe((result) => {
        expect(result.data.path[0].name).toBe('application One');
      });
      const req = httpMock.expectOne(`applications/${1}/path`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyApplicationPath);
    });
  });

  describe('getDataTypes', () => {
    it('should return datatypes>', () => {
      service.getDataTypes(1).subscribe((result) => {
        expect(result.data.items[0].name).toBe('datatype One');
      });
      const req = httpMock.expectOne(`application/${1}/contentdataTypes`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyApplicationDataTypes);
    });
  });

  describe('search', () => {
    it('should return application paths', () => {
      service.search(1, 'key').subscribe((result) => {
        expect(result.data.items[0].path[0].name).toBe('application One');
      });
      const req = httpMock.expectOne(`applications/${1}/paths/?keyword=key`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyApplicationPaths);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
