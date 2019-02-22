import { ReportTypes, ReportActions } from './report.actions';
import { ReportRecord } from '../../models';
import _assign from 'lodash/assign';

export interface ReportState {
  audit: {
    loading: boolean,
    items: ReportRecord[],
    limit?: number,
    offset?: number,
    filters: string,
    sort: string
  };
}

export const initialState: ReportState = {
  audit: {
    loading: false,
    items: null,
    filters: null,
    sort: null
  }
};

export function reducer(
  state: ReportState = initialState,
  action: ReportActions
): ReportState {
  switch (action.type) {
    case ReportTypes.FETCH_AUDIT_DATA:
      return _assign({}, state, {
        audit: _assign({}, state.audit, {
          loading: true,
          filters: action.payload.filters,
          sort: action.payload.sort
        })
      });
    case ReportTypes.FETCH_AUDIT_DATA_COMPLETED:
      return _assign({}, state, {
        audit: _assign({}, state.audit, {
          items: action.payload,
          loading: false
        })
      });
    case ReportTypes.FETCH_AUDIT_REPORTS_ERROR:
      return _assign({}, state, {
        audit: {
          loading: false
        }
      });
      case ReportTypes.FETCH_AUDIT_REPORTS_SUCCESS:
      return _assign({}, state, {
        audit: {
          loading: false,
          items: action.payload.items,
          limit: action.payload.limit,
          offset: action.payload.offset
        }
      });
      default:
       return state;
  }
}

export const getAuditData = (state: ReportState) => state.audit.items;
export const getAuditDataState = (state: ReportState) => state.audit;
