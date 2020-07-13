import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Link } from './core/models';


@Injectable({providedIn: 'root'})
export class AppConfigService {
  private _config: IAppConfig;
  constructor(private http: HttpClient) {}
  load() {
    const cacheBuster = +new Date;
    const jsonFile = '/assets/config/app-config.json?v=' + cacheBuster;
    return new Promise<void>((resolve, reject) => {
        this.http.get(jsonFile).toPromise().then((response: IAppConfig) => {
          this._config = response;
          this._config.apis.forEach(async api => {
          if (!api.AddLinks) { return; }
          const linkApi = this.getApiByName(
            api.AddLinks.apiName
          );
          const links = await this.http.get<{data: {_links: Link[]}}>(`${linkApi.url}/${api.AddLinks.endPoint}`).toPromise();
          api.AddLinks._links = links.data._links;
        });

            resolve();
        }).catch(() => {
            reject('Failed to load the app-config.json file');
        });
    });
  }
  get config() {
    return this._config;
  }

  getApiByRoute(url: string) {

    return this.config ? this.config.apis.find(a => new RegExp(a.routePatern).test(url)) : null;
  }
  getApiByName(name: string) {
    return this.config  ? this.config.apis.find(a => a.name === name) : null;
  }
}

export interface IAppConfig {
  apis: {
  name: string;
  routePatern: RegExp;
  url: string;
  AddLinks?: {apiName: string, endPoint: string, _links: Link[], paramName: string } }[];

}

export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}
