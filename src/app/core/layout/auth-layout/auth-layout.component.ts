import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, isAuthenticated, Go, LogoutAction } from '@forge/core-store';
import { takeWhile, filter } from 'rxjs/operators';

@Component({
  selector: 'fge-auth-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {    
  }

  onLogoutClicked(event: Event): void {
    this.store.dispatch(new LogoutAction(event.type));
  }
}
