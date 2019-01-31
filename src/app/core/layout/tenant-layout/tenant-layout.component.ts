import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import {
  State,
  getApplicationBranding,
  isLoadingApplicationData,
 } from '@forge/core-store';
import { ApplicationBranding } from '../../models';

@Component({
  selector: 'fge-tenant-layout',
  templateUrl: './tenant-layout.component.html',
})
export class TenantLayoutComponent implements OnInit, OnDestroy {

  loading$: Observable<boolean> | boolean;

  private isAliveComponent = true;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.initSelectors();
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  private initSelectors(): void {
    this.store.select(getApplicationBranding)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((branding: ApplicationBranding) => this.applyBranding(branding));
    this.loading$ = this.store.select(isLoadingApplicationData);
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
        .note-modal-footer .note-btn {
          background-color: ${branding.secondaryColor.value} !important;
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
