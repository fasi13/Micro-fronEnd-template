import { CultureService } from './../services/culture.service';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CultureInterceptor implements HttpInterceptor {
  constructor(private cultureService: CultureService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const culture: string = this.cultureService.getCurrentCulture();
    const header = {
      setHeaders: {
        'Accept-Language': culture || 'en-US',
      },
    };
    req = req.clone(header);
    return next.handle(req);
  }
}
