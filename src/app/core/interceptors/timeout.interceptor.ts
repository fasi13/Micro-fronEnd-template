import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeoutService } from '../services/timeout.service';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(private timeoutService: TimeoutService, private appConfigService: AppConfigService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.appConfigService.config && request.url.indexOf(this.appConfigService.config.apis[0].url) >= 0) {
      this.timeoutService.requestReceived();
    }

    return next.handle(request);
  }
}
