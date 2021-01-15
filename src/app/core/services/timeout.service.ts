import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser, LogoutAction, ResetCultureAction, State } from '@forge/core-store';
import { ApplicationService } from './application.service';
import { User } from '../models';
import { TimeoutComponent } from '../session/timeout.component';

@Injectable({
  providedIn: 'root',
})
export class TimeoutService {
  user: User;
  timeoutComponent: TimeoutComponent;

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
    if (this.user && this.timeoutComponent) {
      this.timeoutComponent.resetSessionTimeout(this.user.authenticationTokenLifespanMinutes, this.timeoutComponent);
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
