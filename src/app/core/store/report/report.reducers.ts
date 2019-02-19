import { ReportTypes, ReportActions } from './report.actions';

import _assign from 'lodash/assign';

export interface ReportState {
  audit: {
    items: any[];
    loading: boolean;
  };
}

export const initialState: ReportState = {
  audit: {
    items: null,
    loading: false
  }
};

export function reducer(
  state: ReportState = initialState,
  action: ReportActions
) {
  switch (action.type) {
    case ReportTypes.FETCH_AUDIT_DATA:
      return _assign({}, state, {
        audit: {
          loading: true
        }
      });
    case ReportTypes.FETCH_AUDIT_DATA_COMPLETED:
      return _assign({}, state, {
        audit: _assign({}, state.audit, {
          items: action.payload,
          loading: false
        })
      });
  }
}

export const getAuditData = (state: ReportState) => state.audit.items;
