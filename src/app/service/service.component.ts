import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser, State } from '@forge/core-store';
import { AppConfigService } from '../app-config.service';
import { User } from '../core/models';
@Component({
  selector: 'fge-service',
  templateUrl: './service.component.html'
})
export class ServiceComponent implements OnInit  {
  componentHtml: SafeHtml;
  user: User;
  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private appConfigService: AppConfigService, private store: Store<State>) {
    this.store.select(getAuthenticatedUser)
    .subscribe((user: User) => {
      this.user = user;
    });
  }
  ngOnInit() {
    let applicationId = Number(this.route.snapshot.params['tenantId']);
    let baseHref = this.router.url.split('/').slice(0, 5).join("/");
    let configId = this.router.url.split('/')[4];
    // we get the config id, by id to prevent XSS, so we don't inject the string directly in the DOM from the url
    let config = this.appConfigService.config.services.find((x) => x.id == configId);
    let serviceId = config.id;
    let html = `<e2e-${serviceId}-management-app application-id="${applicationId}" base-href="${baseHref}" user-identity="${this.user.id}"></e2e-${serviceId}-management-app>`
    this.componentHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
