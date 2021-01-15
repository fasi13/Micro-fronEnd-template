import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser, LogoutAction, ResetCultureAction, State } from '@forge/core-store';
import { ApplicationService } from './application.service';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TimeoutService {
  user: User;
  onRequestReceived: Function = function () { };

  constructor(
    private store: Store<State>,
    private applicationService: ApplicationService
  ) {
    this.store.select(getAuthenticatedUser)
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  requestReceived() {
    if (this.user) {
      this.onRequestReceived(this.user.authenticationTokenLifespanMinutes);
    }
  }

  extendSession() {
    this.applicationService.getApplicationInfo(this.user.applicationId as number).subscribe(() => { });
  }

  logout() {
    this.store.dispatch(new ResetCultureAction());
    this.store.dispatch(new LogoutAction(new Event('click').type));
  }
}
