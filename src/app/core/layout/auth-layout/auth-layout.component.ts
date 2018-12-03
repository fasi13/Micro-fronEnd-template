import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { takeWhile } from 'rxjs/operators';

import {
  State,
  LogoutAction,
  getAuthenticatedUser,
  getApplicationInfo,
  getApplicationBranding,
  isLoadingApplicationData,
  getApplicationPath,
} from '@forge/core-store';
import { User, ApplicationBranding, Application } from '@forge/core';
import { FgeRouterService } from '../../services/_fge-router.service';
import { ApplicationPath } from '../../models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'fge-auth-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit, OnDestroy {

  application: Application;
  rootApplication: ApplicationPath;
  pathData: ApplicationPath[];
  user: User;
  branding: ApplicationBranding;
  loading$: Observable<boolean> | boolean = true;
  activeSidebar = true;
  search = '';
  isNavigationModalOpened = false;

  private isAliveComponent = true;

  constructor(
    private store: Store<State>,
    private fgeRouter: FgeRouterService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initSelectors();
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  onLogoutClicked(event: Event): void {
    this.store.dispatch(new LogoutAction(event.type));
  }

  toggleSidebar(event: Event): void {
    event.stopPropagation();
    this.activeSidebar = !this.activeSidebar;
  }

  toggleHierarchyNavigation(event: Event): void {
    event.stopPropagation();
    this.isNavigationModalOpened = !this.isNavigationModalOpened;
  }

  onAppSelected(appId: string): void {
    this.isNavigationModalOpened = false;
    this.router.navigate([`/tenant/${appId}`]);
  }

  private initSelectors(): void {
    this.loading$ = this.store.select(isLoadingApplicationData);
    this.store.select(getApplicationInfo)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((application: Application) => this.application = application);
    this.store.select(getAuthenticatedUser)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((user: User) => this.user = user);

    this.store.select(getApplicationBranding)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((branding: ApplicationBranding) => this.branding = branding);
    this.store.select(getApplicationPath)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe(path => {
        if (path && path.data) {
          this.pathData = path.data;
          this.rootApplication = path.data[0];
        }
      });
  }

  onRediretToResetPassword() {
    this.fgeRouter.navigate(`reset-password`);
  }
}
