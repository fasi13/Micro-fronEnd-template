import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import _isEmpty from 'lodash/isEmpty';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class ProxyApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!_isEmpty(environment.apiUrl) && !request.url.startsWith('http')) {
      request = request.clone({
        url: `${environment.apiUrl}/${request.url}`
      });
    }
    return next.handle(request);
  }
}
