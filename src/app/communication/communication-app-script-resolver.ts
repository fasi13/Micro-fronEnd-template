import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { AppConfigService } from "../app-config.service";

@Injectable({ providedIn: 'root' })
export class CommunicationAppScriptResolver implements Resolve<boolean> {
  loaded = false;
  constructor(private appConfig: AppConfigService) {}
  resolve(): Observable<any>|Promise<any>|any {
    return new Promise((resolve, reject) => {
      if (this.loaded)
      {
        resolve(true);
        return;
      }
      const scriptElement = window.document.createElement('script');
      scriptElement.src = this.appConfig.config.e2eCommunicationManagementAppPackageUrl;
      scriptElement.onload = () => {
        resolve(true);
      };
      scriptElement.onerror = () => {
        reject("unable to load communication app script package");
      };
      window.document.body.appendChild(scriptElement);
      this.loaded = true;
    });
  }
}
