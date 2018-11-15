import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { UserCredentials, UserToken, User, DataPaginated, ApiResponse, } from '../models';

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

  getToken(): UserToken {
    return localStorage.getItem('token');
  }

  logout(reason: string = 'Iddle', isAuth = true): Observable<boolean> {
    console.log('Logout - reason: ', reason);
    if (isAuth) {
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

  getUsers(): Observable<ApiResponse<DataPaginated<User>>> {
    return this.httpClient.get<ApiResponse<DataPaginated<User>>>(this.baseUrl);
  }
}
