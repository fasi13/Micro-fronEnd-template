import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeoutService } from '../services/timeout.service';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(private timeoutService: TimeoutService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.timeoutService.requestReceived();
    return next.handle(request);
  }
}
