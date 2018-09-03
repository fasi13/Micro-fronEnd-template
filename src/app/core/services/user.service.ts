import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { UserCredentials } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = '/users';

  constructor(
    private httpClient: HttpClient
  ) { }

  authenticate({ username, password }: UserCredentials): Observable<HttpResponse<Response>> {
    const url = `${this.baseUrl}/me`;
    const userBtoa = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({ Authorization : `Basic ${userBtoa}` })
    return this.httpClient.get<Response>(url, { headers, observe: 'response' });
  }

  logout(reason: string = 'Iddle', isAuth = true): Observable<boolean> {
    if (isAuth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('application_data');
    }
    return of(isAuth);
  }
}
