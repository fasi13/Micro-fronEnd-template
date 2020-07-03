import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import _isEmpty from 'lodash/isEmpty';

import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/app-config.service';


@Injectable()
export class ProxyApiInterceptor implements HttpInterceptor {

  constructor(private appConfigService: AppConfigService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('app-config.json') === -1
      && !_isEmpty(this.appConfigService.config.apiUrl)
      && !request.url.startsWith('http')) {
      request = request.clone({
        url: `${this.appConfigService.config.apiUrl}/${request.url}`
      });
    }
    return next.handle(request);
  }
}
