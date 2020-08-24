import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import _isEmpty from 'lodash/isEmpty';

import { Observable, of } from 'rxjs';

import { UserCredentials, UserToken, User, DataPaginated, ApiResponse, UserResetPassword } from '../models';
import { Router, NavigationExtras } from '@angular/router';
import { PARAMETERS } from '@angular/core/src/util/decorators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'users';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  authenticate({ username, password }: UserCredentials): Observable<HttpResponse<Response>> {
    const url = `${this.baseUrl}/me`;
    const userBtoa = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({ Authorization : `Basic ${userBtoa}` });
    return this.httpClient.get<Response>(url, { headers, observe: 'response' });
  }

  getToken(): UserToken {
    return localStorage.getItem('token');
  }

  logout(reason: string = 'Action', isAuth = true): Observable<boolean> {
    if (isAuth) {
      const navigationExtras: NavigationExtras = {};
      /**
       * Checks if the logout reason is 'inactivity' to append route query param
       * That is used to redirect to that route when user login after some iddle time
       */
      if (reason === 'Inactivity') {
        navigationExtras.queryParams = {
          route: this.router.url
        };
      }
      /**
       * Redirects to login page
       */
      console.log('Logout - reason: ', reason);
      this.router.navigate(['/login'], navigationExtras);
      /**
       * Cleans local storage items
       */
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('application_data');
    }
    return of(isAuth);
  }

  createNewUser(applicationId: string, newUser: User): Observable<ApiResponse<User>> {
    return this.httpClient.post<ApiResponse<User>>(`application/${applicationId}/${this.baseUrl}`, newUser);
  }

  updateUser(applicationId: string, updatedUser: User): Observable<ApiResponse<User>> {
    return this.httpClient.put<ApiResponse<User>>(`application/${applicationId}/${this.baseUrl}`, updatedUser);
  }

  getUsers(applicationId: string | number, offset?: number, limit?: number, filters?: {[key: string]: string},
    sort?: { sortby: string, sortdirection: string }): Observable<ApiResponse<DataPaginated<User>>> {
    let params = new HttpParams();
    if (offset >= 0) {
      params = params.set('offset', `${offset}`);
    }
    if (limit) {
      params = params.set('limit', `${limit}`);
    }
    params = this.setParams(params, filters, sort);
    const url = `application/${applicationId}/users`;
    return this.httpClient.get<ApiResponse<DataPaginated<User>>>(url, { params });
  }

  exportUserList(applicationId: string | number, filters?: {[key: string]: string},
    sort?: { sortby: string, sortdirection: string }): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    params = this.setParams(params, filters, sort);
    const url = `application/${applicationId}/users/export`;
    return this.httpClient.get<HttpResponse<any>>(url,
      { params, responseType: 'text' as 'json', observe: 'response' });
  }

  resetPassword(userId: number, resetPassword: UserResetPassword): Observable<ApiResponse<UserResetPassword>> {
    const url = `${this.baseUrl}/${userId}/password`;
    return this.httpClient.put<ApiResponse<UserResetPassword>>(url, resetPassword);
  }

  setParams(params: HttpParams, filters?: {[key: string]: string}, sort?: { sortby: string, sortdirection: string }) {
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
    return params;
  }
}
