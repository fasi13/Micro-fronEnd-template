import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import _isEmpty from 'lodash/isEmpty';

import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FgeNotificationService } from '../services';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {

  constructor(
    private fgeNotificationService: FgeNotificationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
          if (event instanceof HttpResponse) {
            this.fgeNotificationService.handleResponse(event, request);
          }
        }
      ),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          try {
            this.fgeNotificationService.handleResponse(error, request);
          } catch (e) {
            this.fgeNotificationService.displayUnexpectedError(e);
          }
        }
        return of(error);
      })
    );
  }
}
