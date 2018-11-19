import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { State, LogoutAction } from '@forge/core-store';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(
    private store: Store<State>
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((response: HttpResponse<Response>) => {
          if (response instanceof HttpErrorResponse && response.status === 401) {
            this.store.dispatch(new LogoutAction('Unauthorized'));
          }
          return throwError(response);
        })
      );
  }
}
