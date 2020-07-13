
import { AppConfigService } from './../../app-config.service';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import _isEmpty from 'lodash/isEmpty';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpResponseLinksInterceptor implements HttpInterceptor {
  constructor(
    private appConfigService: AppConfigService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          const api = this.appConfigService.getApiByName(
            request.headers.get('apiname')
          );
          if (api && api.AddLinks) {
            debugger;
          const newBody =  { ...event.body,
            data: {...event.body.data, _links: [...event.body.data._links, ...api.AddLinks._links] }};
            event = event.clone({
              body: newBody,
            });
          }
        }
        return event;
      })
    );
  }
}
