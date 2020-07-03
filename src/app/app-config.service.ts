import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AppConfigService {
  private _config: IAppConfig;
  constructor(private http: HttpClient) {}
  load() {
    const cacheBuster = +new Date;
    const jsonFile = '/assets/config/app-config.json?v=' + cacheBuster;
    return new Promise<void>((resolve, reject) => {
        this.http.get(jsonFile).toPromise().then((response: IAppConfig) => {
            this._config = <IAppConfig>response;
            resolve();
        }).catch(() => {
            reject('Failed to load the app-config.json file');
        });
    });
  }
  get config() {
    return this._config;
  }
}

export interface IAppConfig {
  apiUrl: string;
}

export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}
