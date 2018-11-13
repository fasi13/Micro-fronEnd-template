import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';

import {
  ContentActionTypes,
  FetchContentGroupsCompleted,
  FetchContentError,
  FetchContentGroupCompleted,
  FetchContentGroup,
  TransactionContentRecordCompleted,
  TransactionContentRecordError
} from './content.actions';
import { ContentService } from '../../services';
import { ApiResponse, DataPaginated, ApplicationContent, ContentGroup } from '../../models';

@Injectable()
export class ContentEffects {

  @Effect() public fetchContentGroups: Observable<Action> = this.actions.pipe(
    ofType(ContentActionTypes.FETCH_CONTENT_GROUPS),
    switchMap((action: any) => this.contentService.getContentGroups(action.payload.applicationId, action.payload.fetchContent)
        .pipe(
          map((response: ApiResponse<DataPaginated<ApplicationContent>>) => new FetchContentGroupsCompleted(response.data.items)),
          catchError(error => of(new FetchContentError({ error: error })))
        )
    )
  );

  @Effect() public fetchContentGroup: Observable<Action> = this.actions.pipe(
    ofType(ContentActionTypes.FETCH_CONTENT_GROUP),
    switchMap((action: any) => this.contentService.getContentGroup(action.payload.applicationId,
      action.payload.groupId, action.payload.fetchContent)
        .pipe(
          map((response: ApiResponse<ContentGroup>) => new FetchContentGroupCompleted(response.data)),
          catchError(error => of(new FetchContentError({ error: error })))
        )
    )
  );

  @Effect() public addContent: Observable<Action> = this.actions.pipe(
    ofType(ContentActionTypes.CONTENT_RECORD_TRANSACTION),
    switchMap((action: any) => this.contentService.addContentToGroup(action.payload.applicationId,
      action.payload.groupId, action.payload.contentPayload)
        .pipe(
          mergeMap(() => [
            new TransactionContentRecordCompleted(),
            new FetchContentGroup({ applicationId: action.payload.applicationId, groupId: action.payload.groupId })
          ]),
          catchError(error => of(new TransactionContentRecordError(error)))
        )
    )
  );

  constructor(
    private actions: Actions,
    private contentService: ContentService,
  ) {
  }
}
