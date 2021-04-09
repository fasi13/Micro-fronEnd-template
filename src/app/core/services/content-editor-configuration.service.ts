
import { Injectable } from '@angular/core';
import { CultureService } from './culture.service';
import { UserService } from '.';
import { AppConfigService } from 'src/app/app-config.service';
import { ContentEditorConfiguration } from '@e2e/content-management-components';

@Injectable({
  providedIn: 'root',
})
export class ContentEditorConfigurationService {
  loaded: boolean = false;
  constructor(private userService: UserService, private cultureService: CultureService, private appConfigService: AppConfigService) {}
  get(applicationId: number|string): ContentEditorConfiguration {
    this.loadPackage();
    const api = this.appConfigService.getApiByName('E2E.Content.Management.API');
    return {
      e2eContentManagementApiUrl: api.url,
      e2eContentManagementApiAuthenticate: (headers) => {
        const token: string = this.userService.getToken();
        headers['Authorization'] = `Token ${token}`;
      },
      cultureCode: this.cultureService.getCurrentCulture(),
      applicationId: parseInt(applicationId.toString()),
    }
  }
  loadPackage() {
    if (!this.loaded) {
      this.loaded = true;
      const scriptElement = window.document.createElement('script');
      scriptElement.src = 'assets/content-management-components/loader.js';
      window.document.body.appendChild(scriptElement);
    }
  }
}
