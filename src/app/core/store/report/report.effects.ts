import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  ReportTypes,
  FetchAuditDataCompleted,
  FertchAuditReportSuccess,
  FertchAuditReportError
} from './report.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ReportService } from '../../services/report.service';
import { DataPaginated } from '../../models';

import { Report, ApiResponse } from '../../models';

@Injectable()
export class ReportEffects {
  mockData = [
    {
      login: 'userone',
      firstName: 'Jonathan',
      lastName: 'Wiliamson',
      application: {
        path: [
          {
            id: 3671,
            name: 'ScoreCard',
            value: '796'
          },
          {
            id: 8494,
            name: '111111',
            value: '111111',
            applicationGroupId: 62
          }
        ],
        _links: [
          {
            rel: 'application',
            method: {
              method: 'GET'
            },
            href: 'https://toolsservices-qa.awardcenter.com/application/8494',
            name: '111111'
          }
        ]
      },
      section: 'Banners',
      actionPerformed: 'Delete',
      actionDate: '2018-10-30 15:43:30'
    },
    {
      login: 'usertwo',
      firstName: 'Jonathan',
      lastName: 'Wiliamson',
      application: {
        path: [
          {
            id: 3671,
            name: 'ScoreCard',
            value: '796'
          },
          {
            id: 8494,
            name: '111111',
            value: '111111',
            applicationGroupId: 62
          }
        ],
        _links: [
          {
            rel: 'application',
            method: {
              method: 'GET'
            },
            href: 'https://toolsservices-qa.awardcenter.com/application/8494',
            name: '111111'
          }
        ]
      },
      section: 'Banners',
      actionPerformed: 'Delete',
      actionDate: '2018-10-30 15:43:30'
    },
    {
      login: 'userthree',
      firstName: 'Jonathan',
      lastName: 'Wiliamson',
      application: {
        path: [
          {
            id: 3671,
            name: 'ScoreCard',
            value: '796'
          },
          {
            id: 8494,
            name: '111111',
            value: '111111',
            applicationGroupId: 62
          }
        ],
        _links: [
          {
            rel: 'application',
            method: {
              method: 'GET'
            },
            href: 'https://toolsservices-qa.awardcenter.com/application/8494',
            name: '111111'
          }
        ]
      },
      section: 'Banners',
      actionPerformed: 'Delete',
      actionDate: '2018-10-30 15:43:30'
    }
  ];

  @Effect() public fetchAuditData: Observable<Action> = this.actions.pipe(
    ofType(ReportTypes.FETCH_AUDIT_DATA),
    switchMap(() => {
      return of(this.mockData).pipe(
        map((data: any) => new FetchAuditDataCompleted(data))
      );
    })
  );

  @Effect() public fetchAuditReports: Observable<Action> = this.actions.pipe(
    ofType(ReportTypes.FETCH_AUDIT_REPORTS),
    switchMap((mockData: any) =>
      this.reportService
        .getAuditReports(
          mockData.payload.offset,
          mockData.payload.limit,
          mockData.payload.filters,
          mockData.payload.sort
        )
        .pipe(
          map((response: ApiResponse<DataPaginated<Report>>) => {
            return new FertchAuditReportSuccess(response.data);
          }),
          catchError(error => of(new FertchAuditReportError({ error: error })))
        )
    )
  );

  constructor(private actions: Actions, private reportService: ReportService) {}
}
