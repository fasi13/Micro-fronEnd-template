import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationBranding, User } from '../../models';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State,
   getApplicationBranding,
   getAuthenticatedUser,
   FetchDataTypes,
   FetchContentGroups,
   FetchApplicationPath,
   FetchApplicationData,
   isLoadingApplicationData,
  } from '@forge/core-store';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'fge-tenant-layout',
  templateUrl: './tenant-layout.component.html',
})
export class TenantLayoutComponent implements OnInit, OnDestroy {

  loading$: Observable<boolean> | boolean;

  private isAliveComponent = true;
  private userUnsubscription = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.initSelectors();
    this.activatedRoute.params
    .subscribe((params) => {
      this.loadApplicationData(params.tenantId);
    });
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.userUnsubscription.complete();
  }

  private loadApplicationData(tenantId: string): void {
    this.store.select(getAuthenticatedUser)
      .pipe(takeUntil(this.userUnsubscription))
      .subscribe((user: User) => {
        if (user) {
          const applicationId = this.getCurrentApplicationId(tenantId, user);
          this.store.dispatch(new FetchApplicationData(applicationId));
          this.store.dispatch(new FetchApplicationPath(applicationId));
          this.store.dispatch(new FetchContentGroups({ applicationId }));
          this.store.dispatch(new FetchDataTypes(applicationId));
          this.userUnsubscription.next();
        }
      });
  }

  private initSelectors(): void {
    this.store.select(getApplicationBranding)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((branding: ApplicationBranding) => this.applyBranding(branding));
    this.loading$ = this.store.select(isLoadingApplicationData);
  }

  private getCurrentApplicationId(tenantId: string, user: User) {
    let applicationId = tenantId;
    if (isNaN(+tenantId)) {
      const appUrl = user.actions['getApplication'].href;
      const splittedUrl = appUrl.split('/');
      applicationId = splittedUrl[splittedUrl.length - 1];
    }
    return applicationId;
  }

  private applyBranding(branding: ApplicationBranding): void {
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
          color: ${branding.secondaryColor.value} !important;
        }
        .page-item.active .page-link {
          background-color: ${branding.primaryColor.value} !important;
          border-color: #cacaca;
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

}
