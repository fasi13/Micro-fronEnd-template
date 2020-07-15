import { Link } from './../models/commons/link.model';
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
  constructor(private appConfigService: AppConfigService) {}
/* istanbul ignore next */
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
            const newBody = {
              ...event.body,
              data: {
                ...event.body.data,
                _links: [
                  ...event.body.data._links,
                  ...this.getLinks(request.url, api.AddLinks._links, api.routePatern),
                ],
              },
            };
            event = event.clone({
              body: newBody,
            });
          }

        }

        return event;
      })
    );
  }
  getLinks(url: string, links: Link[], patern: RegExp): Link[] {
    const endpoint = url.match(patern)[0];
    const params = url.substring(url.lastIndexOf(endpoint)) ;
    const applicationId = params.split('/')[1];
    return links.map((link: Link) => ({ ...link, href: link.href.replace('/0/', `/${applicationId}/`) }));
  }
}
