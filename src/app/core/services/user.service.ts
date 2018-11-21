import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { UserCredentials, UserToken, User, DataPaginated, ApiResponse, UserResetPassword } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'users';

  constructor(
    private httpClient: HttpClient
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

  logout(reason: string = 'Iddle', isAuth = true): Observable<boolean> {
    if (isAuth) {
      console.log('Logout - reason: ', reason);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('application_data');
    }
    return of(isAuth);
  }

  createNewUser(newUser: User): Observable<ApiResponse<User>> {
    return this.httpClient.post<ApiResponse<User>>(this.baseUrl, newUser);
  }

  updateUser(updatedUser: User): Observable<ApiResponse<User>> {
    return this.httpClient.put<ApiResponse<User>>(this.baseUrl, updatedUser);
  }

  getUsers(offset?: number, limit?: number): Observable<ApiResponse<DataPaginated<User>>> {
    let params = new HttpParams();
    if (offset >= 0) {
      params = params.set('offset', `${offset}`);
    }
    if (limit) {
      params = params.set('limit', `${limit}`);
    }
    return this.httpClient.get<ApiResponse<DataPaginated<User>>>(this.baseUrl, { params });
  }

  resetPassword(userId: number, resetPassword: UserResetPassword): Observable<ApiResponse<UserResetPassword>> {
    const url = `${this.baseUrl}/${userId}/password`;
    return this.httpClient.put<ApiResponse<UserResetPassword>>(url, resetPassword);
  }
}
