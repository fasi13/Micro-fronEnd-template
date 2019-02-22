import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { ReportTypes, FertchAuditReportSuccess, FertchAuditReportError } from './report.actions';

import { catchError, switchMap, map } from 'rxjs/operators';

import { ReportService } from '../../services/report.service';
import { ReportRecord, ApiResponse, DataPaginated } from '../../models';
@Injectable()
export class ReportEffects {
  /*mockData = [
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
  );*/

  @Effect() public fetchAuditData: Observable<Action> = this.actions.pipe(
    ofType(ReportTypes.FETCH_AUDIT_DATA),
    switchMap((action: any) => this.reportService.getReportData(
      action.payload.offset,
      action.payload.limit,
      action.payload.filters,
      action.payload.sort)
      .pipe(
        map((response: ApiResponse<DataPaginated<ReportRecord>>) => {
          return new FertchAuditReportSuccess(response.data.items);
        }),
        catchError(error => of(new  FertchAuditReportError({ error: error })))
      )
    )
  );

  constructor(private actions: Actions, private reportService: ReportService) {} // , private reportService: ReportService
}
