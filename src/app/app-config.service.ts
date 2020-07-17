import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Link } from './core/models';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private _config: IAppConfig;
  constructor(private http: HttpClient) {}
  load() {
    const cacheBuster = +new Date();
    const jsonFile = '/assets/config/app-config.json?v=' + cacheBuster;
    return new Promise<void>((resolve, reject) => {
      this.http
        .get(jsonFile)
        .toPromise()
        .then((response: IAppConfig) => {
          this._config = response;
          resolve();
        })
        .catch(() => {
          reject('Failed to load the app-config.json file');
        });
    });
  }
  get config() {
    return this._config;
  }
  getApplicationIdfromUrl(requestUrl: string, routePatern: RegExp) {
    const endpoint = requestUrl.match(routePatern)[0];
    const params = requestUrl.substring(requestUrl.lastIndexOf(endpoint));
    return params.split('/')[1];
  }
  getApiByRoute(url: string) {
    return this.config
      ? this.config.apis.find((a) => {
          return new RegExp(a.routePatern).test(url);
        })
      : null;
  }
  getApiByName(name: string) {
    return this.config ? this.config.apis.find((a) => a.name === name) : null;
  }
}

export interface IAppConfig {
  apis: {
    name: string;
    routePatern: RegExp;
    url: string;
    AddLinks?: {
      apiName: string;
      endPoint: string;
    };
  }[];
}

export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}
