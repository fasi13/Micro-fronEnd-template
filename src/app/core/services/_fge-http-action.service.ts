import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Link, FgeEntity } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FgeHttpActionService {

  constructor(
    private httpClient: HttpClient
  ) { }

  performAction(data: FgeEntity, action: string, payload?: any): Observable<FgeEntity | any> {
    if (data) {
      const link: Link = this.getAction(data, action);
      if (link) {
        const { method, href } = link;
        switch (method.method) {
          case 'POST':
            return this.httpClient.post(href, payload);
          case 'PUT':
            return this.httpClient.put(href, payload);
          case 'GET':
            return this.httpClient.get(href);
          default:
            throw Observable.throw(`${method.method} not supported by transaction model`);
        }
      } else {
        throw Observable.throw(`${action} not found in current Object data`);
      }
    } else {
      throw Observable.throw(`Invalid FgeEntity value`);
    }
  }

  hasAction(data: FgeEntity, action: string): boolean {
    return !!this.getAction(data, action);
  }

  private getAction(data: FgeEntity, action: string): Link {
    if (data._links) {
      return (data._links as Link[]).find((item) => item.rel === action);
    }
    throw new Error('_links not found in current Object data');
  }
}
