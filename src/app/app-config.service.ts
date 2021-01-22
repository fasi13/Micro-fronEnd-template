import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AppConfigService {
  public _config: IAppConfig;
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
  services: IServiceConfig[];
}

export interface IServiceConfig {
  url: string,
  name: string,
  id: string
}


export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}
