import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FgeNotificationService } from '../services';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {

  constructor(
    private fgeNotificationService: FgeNotificationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
          if (event instanceof HttpResponse || event instanceof HttpErrorResponse) {
            this.fgeNotificationService.handleResponse(event, request);
          }
        }
      )
    );
  }
}
