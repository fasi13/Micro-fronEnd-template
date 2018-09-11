import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { takeWhile, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  State,
  isAuthenticated,
  LogoutAction,
  getAuthenticatedUser,
  getApplicationInfo,
  getApplicationBranding,
  isLoadingApplicationData,
  FetchApplicationData,
  FetchApplicationPath,
  FetchContentGroups,
  FetchDataTypes,
  getApplicationPath,
} from '@forge/core-store';
import { User, ApplicationBranding, Application } from '@forge/core';
import { ApplicationPath } from '../../models';

@Component({
  selector: 'fge-auth-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit, OnDestroy {

  application: Application;
  rootApplication: ApplicationPath;
  user: User;
  branding: ApplicationBranding;
  loading$: Observable<boolean> | boolean = true;
  activeSidebar = true;
  search = '';
  isNavigationModalOpened = false;

  private isAliveComponent = true;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
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
    setTimeout(() => {
      location.href = `/tenant/${appId}`;
    }, 500);
  }

  private initSelectors(): void {
    this.loading$ = this.store.select(isLoadingApplicationData);
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
        filter(isAuth => isAuth),
      )
      .subscribe(() => {
        const applicationId = this.getCurrentTenantId();
        this.store.dispatch(new FetchApplicationData(applicationId));
        this.store.dispatch(new FetchApplicationPath(applicationId));
        this.store.dispatch(new FetchContentGroups({ applicationId }));
        this.store.dispatch(new FetchDataTypes(this.getCurrentTenantId()));
      });
    this.store.select(getApplicationBranding)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((branding: ApplicationBranding) => this.applyBranding(branding));
    this.store.select(getApplicationPath)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe(path => {
        if (path && path.data) {
          this.rootApplication = path.data[0];
        }
      });
  }

  private getCurrentTenantId() {
    let tenantId = this.route.firstChild.snapshot.params.tenantId;
    if (isNaN(+tenantId)) {
      const appUrl = this.user.actions['getApplication'].href;
      const splittedUrl = appUrl.split('/');
      tenantId = + splittedUrl[splittedUrl.length - 1];
    }
    return tenantId;
  }

  private applyBranding(branding: ApplicationBranding): void {
    this.branding = branding;
    if (branding) {
      const styles = `
        .bg-primary {
          background-color: ${branding.primaryColor.value} !important;
        }
        .bg-secondary {
          background-color: ${branding.secondaryColor.value} !important;
        }
        .text-primary {
          color: ${branding.primaryColor.value} !important;
        }
        .text-secondary {
          color: ${branding.primaryColor.value} !important;
        }
      `;
      const css: any = document.createElement('style');
      css.type = 'text/css';
      if (css.styleSheet) {
        css.styleSheet.cssText = styles;
      } else {
        css.appendChild(document.createTextNode(styles));
      }
      document.getElementsByTagName('head')[0].appendChild(css);
    }
  }

  onRediretToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
