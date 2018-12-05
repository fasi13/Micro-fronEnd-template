import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserCredentials, AuthenticateAction, Go} from '@forge/core';
import { isAuthenticationLoading, State, isAuthenticated, getAuthenticationError } from '../../core/store/store.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fge-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  userCredentials: UserCredentials;
  loading$: Observable<boolean> | boolean = false;
  hasLoginErrors = false;

  private isAliveComponent = true;
  private goToRoute: string;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userCredentials = new UserCredentials();
    this.route.queryParams.subscribe((params) => {
      if (params && params.route) {
        this.goToRoute = params.route;
      }
    });
    this.initSelectors();
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

  private initSelectors(): void {
    this.loading$ = this.store.select(isAuthenticationLoading);
    this.store.select(getAuthenticationError)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((error) => {
        this.hasLoginErrors = !!error;
      });
    this.store.select(isAuthenticated)
      .pipe(
        takeWhile(() => this.isAliveComponent),
        filter(isAuth => isAuth)
      )
      .subscribe(() => {
        const routePath = this.goToRoute || '/';
        this.store.dispatch(new Go({ path: [routePath] }));
      });
  }
}
