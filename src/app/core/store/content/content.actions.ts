import { Action } from '@ngrx/store';

import { ActionType } from '../util';

export const ContentActionTypes = {
  FETCH_CONTENT_GROUPS: ActionType('FETCH_CONTENT_GROUPS'),
  FETCH_CONTENT_GROUPS_COMPLETED: ActionType('FETCH_CONTENT_GROUPS_COMPLETED'),
  FETCH_CONTENT_GROUP: ActionType('FETCH_CONTENT_GROUP'),
  FETCH_CONTENT_GROUP_COMPLETED: ActionType('FETCH_CONTENT_GROUP_COMPLETED'),
  FETCH_CONTENT_ERROR: ActionType('FETCH_CONTENT_ERROR'),
}

export class FetchContentGroups implements Action {
  public type: string = ContentActionTypes.FETCH_CONTENT_GROUPS;
  constructor(public payload?: any) {}
}

export class FetchContentGroupsCompleted implements Action {
  public type: string = ContentActionTypes.FETCH_CONTENT_GROUPS_COMPLETED;
  constructor(public payload?: any) {}
}

export class FetchContentGroup implements Action {
  public type: string = ContentActionTypes.FETCH_CONTENT_GROUP;
  constructor(public payload?: any) {}
}

export class FetchContentGroupCompleted implements Action {
  public type: string = ContentActionTypes.FETCH_CONTENT_GROUP_COMPLETED;
  constructor(public payload?: any) {}
}

export class FetchContentError implements Action {
  public type: string = ContentActionTypes.FETCH_CONTENT_ERROR;
  constructor(public payload?: any) {}
}

export type ContentActions =
  FetchContentGroups |
  FetchContentGroupsCompleted |
  FetchContentGroup |
  FetchContentGroupCompleted |
  FetchContentError;