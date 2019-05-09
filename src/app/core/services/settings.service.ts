import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Application, DataPaginated, SettingGroup, ApiResponse } from '../models';
import { Observable } from 'rxjs';
import { State } from '@forge/core-store';
import { getApplicationInfo } from '../../core/store/store.reducers';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private store: Store<State>,
    private httpClient: HttpClient
  ) { }

  getSettingGroups(): Observable<ApiResponse<DataPaginated<SettingGroup>>> {
    return this.store.select(getApplicationInfo).
      pipe(
        switchMap((application: Application) => {
          return this.httpClient.get<ApiResponse<DataPaginated<SettingGroup>>>(`application/${application.id}/settingGroups`);
        })
      );
  }
}
