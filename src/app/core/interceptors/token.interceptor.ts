import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { UserService } from '../services';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.userService.getToken();
    if (!!token) {
      const header = {
        setHeaders: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const isIE = navigator.userAgent.indexOf('MSIE ') > -1 || navigator.userAgent.indexOf('Trident/') > -1;
      if (isIE) {
        header.setHeaders['Cache-Control'] = 'no-cache';
        header.setHeaders['Pragma'] = 'no-cache';
      }
      request = request.clone(header);
    }
    return next.handle(request);
  }
}
