import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import _isEmpty from 'lodash/isEmpty';
import { HttpClient, HttpParams } from '@angular/common/http';

import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { State } from '@forge/core-store';
import { Application, DataPaginated, SettingGroup, ApiResponse, Setting } from '../models';
import { getApplicationInfo } from '../../core/store/store.reducers';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private store: Store<State>,
    private httpClient: HttpClient
  ) { }

  getSettingGroups(offset?: number, limit?: number, filters?: {[key: string]: string},
    sort?: { sortby: string, sortdirection: string }): Observable<ApiResponse<DataPaginated<SettingGroup>>> {
    return this.store.pipe(
        select(getApplicationInfo),
        switchMap((application: Application) => {
          let params = new HttpParams();
          if (offset >= 0) {
            params = params.set('offset', `${offset}`);
          }
          if (limit) {
            params = params.set('limit', `${limit}`);
          }
          if (filters) {
            Object.keys(filters).forEach(key => {
              const value = filters[key];
              if (!_isEmpty(value)) {
                params = params.set(key, value);
              }
            });
          }
          if (sort) {
            Object.keys(sort).forEach(key => {
              const value = sort[key];
              if (!_isEmpty(value)) {
                params = params.set(key, value);
              }
            });
          }
          return this.httpClient.get<ApiResponse<DataPaginated<SettingGroup>>>(`application/${application.id}/settingGroups`, { params });
        })
      );
  }

  getSettingGroup(applicationId: string | number, groupId: number): Observable<ApiResponse<SettingGroup>> {
    return this.httpClient.get<ApiResponse<SettingGroup>>(
      `application/${applicationId}/settingGroup/${groupId}`, { params: { includeSettings: 'false' }});
  }

  getGroupSettings(applicationId: string | number, groupId: number, offset?: number, limit?: number, filters?: {[key: string]: string},
    sort?: { sortby: string, sortdirection: string }): Observable<ApiResponse<DataPaginated<Setting>>> {
      let params = new HttpParams();
      if (offset >= 0) {
        params = params.set('offset', `${offset}`);
      }
      if (limit) {
        params = params.set('limit', `${limit}`);
      }
      if (filters) {
        Object.keys(filters).forEach(key => {
          const value = filters[key];
          if (!_isEmpty(value)) {
            params = params.set(key, value);
          }
        });
      }
      if (sort) {
        Object.keys(sort).forEach(key => {
          const value = sort[key];
          if (!_isEmpty(value)) {
            params = params.set(key, value);
          }
        });
      }
      return this.httpClient.get<ApiResponse<DataPaginated<Setting>>>(
        `application/${applicationId}/settingGroup/${groupId}/settings`, { params });
  }
}
