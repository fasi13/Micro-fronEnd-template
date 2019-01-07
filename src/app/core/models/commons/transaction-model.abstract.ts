import { Observable } from 'rxjs';

import { Link } from '.';

export abstract class TransactionModel<T = any> {

  constructor(
  ) { }

  performAction(httpClient, data: T, action: string, payload?: any): Observable<any> | void {
    if (data) {
      const link: Link = this.getAction(data, action);
      if (link) {
        const { method, href } = link;
        switch (method.method) {
          case 'POST':
            return httpClient.post(href, payload);
          case 'PUT':
            return httpClient.put(href, payload);
          case 'GET':
            return httpClient.get(href);
          default:
            throw Observable.throw(`${method.method} not supported by ObjectTransactionService`);
        }
      } else {
        throw Observable.throw(`${action} not found in current Object data`);
      }
    }
  }

  hasAction(data: T, action: string): boolean {
    return !!this.getAction(data, action);
  }

  private getAction(data: any, action: string): Link {
    return (data._links as Link[]).find((item) => item.rel === action);
  }
}
