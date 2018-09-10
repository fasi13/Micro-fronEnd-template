import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { HateoasAction } from '../models/hateoas-action.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(
    private httpClient: HttpClient
  ) { }

  performRequest<T>({ method, href }: HateoasAction, body?: any): Observable<T> {
    const httpMethod = this.httpClient[method];
    const args = body ? [ href, body ] : [ href ]; 
    return httpMethod.call(this.httpClient, ...args);
  }
}
