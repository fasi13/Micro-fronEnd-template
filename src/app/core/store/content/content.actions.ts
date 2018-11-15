/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';

import { ActionType } from '../util';

export const ContentActionTypes = {
  FETCH_CONTENT: ActionType('FETCH_CONTENT'),
  FETCH_CONTENT_COMPLETED: ActionType('FETCH_CONTENT_COMPLETED'),
  FETCH_CONTENT_GROUPS: ActionType('FETCH_CONTENT_GROUPS'),
  FETCH_CONTENT_GROUPS_COMPLETED: ActionType('FETCH_CONTENT_GROUPS_COMPLETED'),
  FETCH_CONTENT_GROUP: ActionType('FETCH_CONTENT_GROUP'),
  FETCH_CONTENT_GROUP_COMPLETED: ActionType('FETCH_CONTENT_GROUP_COMPLETED'),
  FETCH_CONTENT_ERROR: ActionType('FETCH_CONTENT_ERROR'),
  CONTENT_RECORD_TRANSACTION: ActionType('CONTENT_RECORD_TRANSACTION'),
  CONTENT_RECORD_TRANSACTION_COMPLETED: ActionType('CONTENT_RECORD_TRANSACTION_COMPLETED'),
  CONTENT_RECORD_TRANSACTION_ERROR: ActionType('CONTENT_RECORD_TRANSACTION_ERROR'),
  CONTENT_EDIT_TRANSACTION: ActionType('CONTENT_EDIT_TRANSACTION'),
  CONTENT_EDIT_TRANSACTION_COMPLETED: ActionType('CONTENT_EDIT_TRANSACTION_COMPLETED'),
  CONTENT_EDIT_TRANSACTION_ERROR: ActionType('CONTENT_EDIT_TRANSACTION_ERROR')
};

export class FetchContent implements Action {
  public type: string = ContentActionTypes.FETCH_CONTENT;
  constructor(public payload?: any) {}
}

export class FetchContentCompleted implements Action {
  public type: string = ContentActionTypes.FETCH_CONTENT_COMPLETED;
  constructor(public payload?: any) {}
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

export class TransactionContentRecord implements Action {
  public type: string = ContentActionTypes.CONTENT_RECORD_TRANSACTION;
  constructor(public payload?: any) {}
}

export class TransactionContentRecordCompleted implements Action {
  public type: string = ContentActionTypes.CONTENT_RECORD_TRANSACTION_COMPLETED;
  constructor(public payload?: any) {}
}

export class TransactionContentRecordError implements Action {
  public type: string = ContentActionTypes.CONTENT_RECORD_TRANSACTION_ERROR;
  constructor(public payload?: any) {}
}

export class TransactionContentEdit implements Action {
  public type: string = ContentActionTypes.CONTENT_EDIT_TRANSACTION;
  constructor(public payload?: any) {}
}

export class TransactionContentEditCompleted implements Action {
  public type: string = ContentActionTypes.CONTENT_EDIT_TRANSACTION_COMPLETED;
  constructor(public payload?: any) {}
}

export class TransactionContentEditError implements Action {
  public type: string = ContentActionTypes.CONTENT_EDIT_TRANSACTION_ERROR;
  constructor(public payload?: any) {}
}

export type ContentActions =
  FetchContent |
  FetchContentCompleted |
  FetchContentGroups |
  FetchContentGroupsCompleted |
  FetchContentGroup |
  FetchContentGroupCompleted |
  FetchContentError;
