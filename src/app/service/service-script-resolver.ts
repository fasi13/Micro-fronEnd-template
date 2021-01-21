import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AppConfigService } from "../app-config.service";

@Injectable({ providedIn: 'root' })
export class ServiceScriptResolver implements Resolve<boolean> {
  loaded = false;
  constructor(private appConfig: AppConfigService) {}
  resolve(_route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return new Promise((resolve, reject) => {
      if (this.loaded)
      {
        resolve(true);
        return;
      }
      const serviceId = state.url.split('/')[4];
      const scriptElement = window.document.createElement('script');
      scriptElement.src = this.appConfig.config.services.find((x) => x.id == serviceId).url;
      scriptElement.onload = () => {
        resolve(true);
      };
      scriptElement.onerror = () => {
        reject(`unable to load ${serviceId} service script package´, url ${scriptElement.src}`);
      };
      window.document.body.appendChild(scriptElement);
      this.loaded = true;
    });
  }
}
