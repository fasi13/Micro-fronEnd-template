
import { SwitchCultureAction, ReadCultureAction, ReadAvailableCulturesAction, ResetCultureAction } from './../../store/culture/culture.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import {
  State,
  LogoutAction,
  getAuthenticatedUser,
  getApplicationInfo,
  getApplicationBranding,
  getApplicationPath,
} from '@forge/core-store';
import { User, ApplicationBranding, Application } from '@forge/core';
import { FgeRouterService } from '../../services';
import { getCurrentCulture , getAvailableCultures } from './../../store/store.reducers';

@Component({
  selector: 'fge-auth-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit, OnDestroy {

  application: Application;
  rootApplication: Application;
  pathData: Application[];
  user: User;
  branding: ApplicationBranding;
  activeSidebar = false;
  search = '';
  isNavigationModalOpened = false;
  currentCulture: string;
  private isAliveComponent = true;
  mySubscription: any;
  availableCultures: string[];

  constructor(
    private store: Store<State>,
    private fgeRouter: FgeRouterService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.InitDispatcher();
    this.initSelectors();
  }
  InitDispatcher() {
    this.store.dispatch(new ReadAvailableCulturesAction());
    this.store.dispatch(new ReadCultureAction());
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  onLogoutClicked(event: Event): void {
    this.store.dispatch(new ResetCultureAction());
    this.store.dispatch(new LogoutAction(event.type));
  }

  toggleSidebar(event: Event): void {
    event.stopPropagation();
    this.activeSidebar = !this.activeSidebar;
  }

  toggleHierarchyNavigation(event: Event): void {
    document.getElementById('sidebarHeader').click();
    event.stopPropagation();
    this.isNavigationModalOpened = !this.isNavigationModalOpened;
  }

  onAppSelected(appId: string): void {
    this.isNavigationModalOpened = false;
    const currentRoute = this.router.url.split('/').slice(3).join('/');
    this.router.navigate([`/tenant/${appId}/${currentRoute}`]);
  }


setContentCulture(cultureCode: string) {
this.store.dispatch(new SwitchCultureAction({cultureCode: cultureCode}));
}
  private initSelectors(): void {
    this.store.select(getApplicationInfo)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((application: Application) => this.application = application);
    this.store.select(getAuthenticatedUser)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((user: User) => this.user = user);
    this.store.select(getApplicationBranding)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((branding: ApplicationBranding) => this.branding = branding);
    this.store.select(getApplicationPath)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe(path => {
        if (path && path.data) {
          const index = path.data.path.findIndex(application => application.id === this.user.applicationId);
          this.pathData = path.data.path.slice(index);
          this.rootApplication = this.pathData[0];
        }
      });
      this.store.select(getAvailableCultures)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((cultures: string[]) => {
        /* istanbul ignore next */
        if (cultures && cultures.length) {
          this.availableCultures = cultures;
        }
        });

    this.store.select(getCurrentCulture)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((cultureCode: string) => {
        /* istanbul ignore next */
        if (!cultureCode) {return; }
        /* istanbul ignore next */
         if (cultureCode && this.currentCulture && cultureCode !== this.currentCulture) {
           /* istanbul ignore next */
         window.location.reload();
         }
         this.currentCulture = cultureCode;
        });
  }

  onRediretToResetPassword() {
    this.fgeRouter.navigate(`reset-password`);
  }
}
