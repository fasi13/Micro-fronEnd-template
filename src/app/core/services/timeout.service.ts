import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser, LogoutAction, ResetCultureAction, State } from '@forge/core-store';
import { User } from '../models';
import { TimeoutComponent } from '../session/timeout.component';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root',
})
export class TimeoutService {
  user: User;
  timeoutComponent: TimeoutComponent;

  constructor(
    private store: Store<State>,
    private contentService: ContentService
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
    this.contentService.getContentGroups(this.user.applicationId as number).subscribe(() => {
      // keep this empty
    });
  }

  logout() {
    this.store.dispatch(new ResetCultureAction());
    this.store.dispatch(new LogoutAction(new Event('click').type));
  }
}
