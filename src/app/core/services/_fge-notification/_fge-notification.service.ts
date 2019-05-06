import { Injectable } from '@angular/core';

import { notificationConfigurations } from './_fge-notification.config';
import { HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import _isEmpty from 'lodash/isEmpty';
import _isFunction from 'lodash/isFunction';

@Injectable({
  providedIn: 'root'
})
export class FgeNotificationService {

  private notificationConfig = notificationConfigurations;
  private readonly DEFAULT_SUCCESS_MSG = 'Action was successfully executed.';
  private readonly DEFAULT_ERROR_MSG = 'Unexpected Error, try again later.';

  constructor(
    private notifierService: NotifierService
  ) { }

  handleResponse(httpResponse: HttpResponse<any> | HttpErrorResponse, httpRequest: HttpRequest<any>) {
    const { url } = httpResponse;
    const { method } = httpRequest;
    const availableConfigs = this.notificationConfig[method];
    if (!_isEmpty(availableConfigs)) {
      Object.keys(availableConfigs).forEach(strRegex => {
        const regex = new RegExp(strRegex);
        if (regex.test(url)) {
          this.displayNotification(strRegex, method, httpResponse);
        }
      });
    }
  }

  displayUnexpectedError(e) {
    console.log(e);
    this.notifierService.notify('error', this.DEFAULT_ERROR_MSG);
  }

  private displayNotification(regexKey: string, httpMethod: string, httpResponse: HttpResponse<any> | HttpErrorResponse) {
    const { success = this.DEFAULT_SUCCESS_MSG, error =  this.DEFAULT_ERROR_MSG} = this.notificationConfig[httpMethod][regexKey];
    if (httpResponse instanceof HttpErrorResponse) {
      this.notifierService.notify('error', this.executeOrGetMessage(error, httpResponse));
    } else {
      this.notifierService.notify('success', this.executeOrGetMessage(success, httpResponse));
    }
  }

  private executeOrGetMessage(message: any, httpResponse: HttpResponse<any> | HttpErrorResponse): string {
    return _isFunction(message) ? message(httpResponse) : message;
  }
}
