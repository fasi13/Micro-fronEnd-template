import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Link, FgeEntity } from '../models';
import { FgeLink } from '../models/commons/_fge-entity-link.model';

@Injectable({
  providedIn: 'root'
})
export class FgeHttpActionService {

  constructor(
    private httpClient: HttpClient
  ) { }

  performAction(data: FgeEntity, actionName: FgeLink | string, options?: {
    body?: any;
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    params?: HttpParams | {
      [param: string]: string | string[];
    };
  }): Observable<FgeEntity | any> {
    if (data) {
      const link: Link = this.getAction(data, actionName);
      if (link) {
        const { method, href } = link;
        return this.httpClient.request(method.method, href, options);
      } else {
        throw new Error(`${actionName} not found in current Object data`);
      }
    } else {
      throw new Error(`Invalid FgeEntity value: ${data}`);
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
