import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserCredentials, AuthenticateAction, Go } from '@forge/core';
import { isAuthenticationLoading, State, isAuthenticated, getAuthenticationError } from '../../core/store/store.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';

@Component({
  selector: 'fge-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  userCredentials: UserCredentials;
  loading$: Observable<boolean> | boolean = false;
  hasLoginErrors = false;

  private isAliveComponent = true;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.userCredentials = new UserCredentials();
    this.loading$ = this.store.select(isAuthenticationLoading);
    this.store.select(getAuthenticationError)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((error) => {
        this.hasLoginErrors = !!error;
      })
    this.store.select(isAuthenticated)
      .pipe(
        takeWhile(() => this.isAliveComponent),
        filter(isAuthenticated => isAuthenticated)
      )
      .subscribe(() => {
        this.store.dispatch(new Go({ path: ['/'] }));
      })
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  onSubmitClicked() {
    const { username, password } = this.userCredentials;
    const payload: UserCredentials = {
      username: username.trim(),
      password: password.trim()
    };
    this.store.dispatch(new AuthenticateAction(payload));
  }
}
