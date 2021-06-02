import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import _isEmpty from 'lodash/isEmpty';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  constructor(private httpClient: HttpClient) { }
  /**
  *  refactor this implemmentation to perform the action from effects.
  * Instead of getting the link here, according to the instruction, must return a list of _link
  * to do the export to follow the implementation of the current effects. Using the fgeActionServices
  */
  getAuditReport(applicationId: string | number, filters?: {[key: string]: string},
    sort?: { sortby: string, sortdirection: string }): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (!_isEmpty(value)) {
          params = params.set(key, value);
        }
      });
    }

    if (sort) {
      Object.keys(sort).forEach(key => {
        const value = sort[key];
        if (!_isEmpty(value)) {
          params = params.set(key, value);
        }
      });
    }

    const baseUrl = `application/${applicationId}/audits/export`;

    return this.httpClient.get<HttpResponse<any>>(baseUrl,
      { params, responseType: 'text' as 'json', observe: 'response' });
  }
}
