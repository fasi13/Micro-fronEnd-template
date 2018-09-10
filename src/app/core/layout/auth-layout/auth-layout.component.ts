import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, isAuthenticated, Go, LogoutAction, getAuthenticatedUser, getApplicationInfo } from '@forge/core-store';
import { takeWhile, filter } from 'rxjs/operators';
import { User } from '../../models';
import { FetchApplicationData } from '../../store/application';
import { Application } from '../../models/application.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'fge-auth-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit, OnDestroy {

  application: Application;
  user: User;

  private isAliveComponent = true;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.store.select(getApplicationInfo)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((application: Application) => this.application = application);
    this.store.select(getAuthenticatedUser)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((user: User) => this.user = user);
    this.store.select(isAuthenticated)
      .pipe(
        takeWhile(() => this.isAliveComponent),
        filter(isAuthenticated => isAuthenticated),
      )
      .subscribe(() => this.store.dispatch(new FetchApplicationData()));
  }

  ngOnDestroy() {
    this.isAliveComponent = false;  
  }

  onLogoutClicked(event: Event): void {
    this.store.dispatch(new LogoutAction(event.type));
  }
}
