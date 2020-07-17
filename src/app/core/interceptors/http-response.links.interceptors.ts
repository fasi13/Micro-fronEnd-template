import { ApiResponse } from './../models/commons/api-response.model';
import { AppConfigService } from './../../app-config.service';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpClient,
} from '@angular/common/http';
import _isEmpty from 'lodash/isEmpty';

import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Application } from '../models/application';

@Injectable()
export class HttpResponseLinksInterceptor implements HttpInterceptor {
  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      mergeMap((event) => {
        const api = this.appConfigService.getApiByName(
          request.headers.get('apiname')
        );

        if (!(event instanceof HttpResponse) || !api || !api.AddLinks) {
          return of(event);
        }
        const linksApi = this.appConfigService.getApiByName(
          api.AddLinks.apiName
        );
        const applicationId = event.body.data.id;
        return this.httpClient
          .get(`${linksApi.url}/${api.AddLinks.endPoint}/${applicationId}`)
          .pipe(
            map((response: ApiResponse<Application>) => {

              const body = event.body;
              body.data._links = [...body.data._links, ...response.data._links];
              return event.clone({
                body: body,
              });
            })
          );
      })
    );
  }
}
