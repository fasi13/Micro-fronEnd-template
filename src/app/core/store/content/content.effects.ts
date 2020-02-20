import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap, withLatestFrom, filter } from 'rxjs/operators';

import {
  ContentActionTypes,
  FetchContentCompleted,
  FetchContentGroupsCompleted,
  FetchContentError,
  FetchContentGroupCompleted,
  FetchContentGroup,
  TransactionContentRecordCompleted,
  TransactionContentRecordError,
  LinkContentActionCompleted,
  LinkContentActionError,
  ContentGroupRecordTransactionCompleted,
  ContentGroupRecordTransactionError
} from './content.actions';
import { ContentService, FgeRouterService, FgeHttpActionService } from '../../services';
import { ApiResponse, DataPaginated, ApplicationContent, ContentGroup, Application, ApplicationLink } from '../../models';
import { UpdateApplicationData } from '../application';
import { State, getApplicationInfo, getGroups } from '../store.reducers';
import { ContentGroupLink } from '../../models/content/content-group-link.model';

enum ContentGroupMethods { POST = 'addContentGroup', PUT = 'updateContentGroup' }

@Injectable()
export class ContentEffects {

  @Effect() public fetchContentGroups: Observable<Action> = this.actions.pipe(
    ofType(ContentActionTypes.FETCH_CONTENT_GROUPS),
    withLatestFrom(this.store.select(getApplicationInfo)),
    switchMap(([_action, applicationInfo]: [any, Application]) =>
      this.fgeActionService.performAction(applicationInfo, ApplicationLink.CONTENT_GROUPS, { params: { content: 'false' }})
        .pipe(
          map((response: ApiResponse<DataPaginated<ApplicationContent>>) => new FetchContentGroupsCompleted(response.data.items)),
          catchError(error => of(new FetchContentError({ error: error })))
        )
    )
  );

  @Effect() public fetchContentGroup: Observable<Action> = this.actions.pipe(
    ofType(ContentActionTypes.FETCH_CONTENT_GROUP),
    switchMap((action: any) =>
      this.store.select(getGroups).pipe(
        filter(groupsList => !!groupsList),
        switchMap((groups: ContentGroup[]) => {
          const group: ContentGroup = groups.find((current: ContentGroup) => current.id === +action.payload);
          if (group) {
            return this.fgeActionService.performAction(group, ContentGroupLink.SELF, { params: { content: 'true' }})
              .pipe(
                map((response: ApiResponse<ContentGroup>) => new FetchContentGroupCompleted(response.data)),
                catchError(error => {
                  this.handleErrorRedirect(error.status);
                  return of(new FetchContentError({ error: error }));
                })
              );
          } else {
            this.fgeRouter.navigate('content/notFound', { skipLocationChange: true });
            return of(new FetchContentError({ error: new Error(`Content group with id=${action.payload} not found in current tenant store`) }));
          }
        })
      )
    )
  );

  @Effect() public fetchContent: Observable<Action> = this.actions.pipe(
    ofType(ContentActionTypes.FETCH_CONTENT),
    switchMap((action: any) => this.contentService.getContent(action.payload.applicationId,
      action.payload.contentId)
        .pipe(
          map((response: ApiResponse<ApplicationContent>) => new FetchContentCompleted(response.data)),
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
            /**
             * @TODO Refactor to send only the group id
             */
            new FetchContentGroup(action.payload.groupId)
          ]),
          catchError(error => of(new TransactionContentRecordError(error)))
        )
    )
  );

  @Effect() public actionContent: Observable<Action> = this.actions.pipe(
    ofType(ContentActionTypes.CONTENT_ACTION_LINK),
    switchMap((action: any) => this.contentService.actionContent(action.payload.link,
      action.payload.contentPayload)
        .pipe(
          mergeMap(() => [
            new LinkContentActionCompleted(),
            /**
             * @TODO Refactor to send only the group id
             */
            new FetchContentGroup(action.payload.groupId),
            new UpdateApplicationData(action.payload.applicationId)
          ]),
          catchError(error => of(new LinkContentActionError(error)))
        )
    )
  );

  @Effect() public contentGroupTransaction: Observable<Action> = this.actions.pipe(
    ofType(ContentActionTypes.CONTENT_GROUP_RECORD_TRANSACTION),
      switchMap((action: any): any => this.handleContentGroupRequest(action.payload, action.method)
        .pipe(
          mergeMap(() => {
            return of(new ContentGroupRecordTransactionCompleted());
          }),
          catchError((error) => {
            return of(new ContentGroupRecordTransactionError({error: error}));
          })
        )
      )
  );

  constructor(
    private actions: Actions,
    private contentService: ContentService,
    private fgeRouter: FgeRouterService,
    private store: Store<State>,
    private fgeActionService: FgeHttpActionService
  ) { }

  private handleErrorRedirect(errorCode) {
    if (errorCode === 404) {
      this.fgeRouter.navigate('content/notFound', { skipLocationChange: true });
    }
  }

  private handleContentGroupRequest(payload, method): any {
    /**
     * @TODO Remove this useless logic, since the request should be performed
     *  using the links from group data
     */
    if (method === 'POST') {
      return this.contentService[ContentGroupMethods[method]](payload.applicationId, payload.groupName);
    } else {
      return this.contentService[ContentGroupMethods[method]](payload.applicationId, payload.group.id, payload.groupName);
    }
  }
}
