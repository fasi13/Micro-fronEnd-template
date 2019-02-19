import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { ReportTypes, FetchAuditDataCompleted } from './report.actions';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class ReportEffects {
  mockData = [
    {
      login: 'usernamelonger1',
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
      login: 'usernamelonger2',
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
      login: 'usernamelonger3',
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

  constructor(private actions: Actions) {}
}
