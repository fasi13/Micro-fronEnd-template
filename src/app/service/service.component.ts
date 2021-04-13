import { UserService } from './../core/services/user.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser, State } from '@forge/core-store';
import { AppConfigService } from '../app-config.service';
import { User } from '../core/models';
import { ComponentCanDeactivate } from './_guards/pending-changes.guard';
@Component({
  selector: 'fge-service',
  templateUrl: './service.component.html'
})
export class ServiceComponent implements OnInit, ComponentCanDeactivate  {
  componentHtml: SafeHtml;
  user: User;
  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private appConfigService: AppConfigService, private store: Store<State>, private userService: UserService) {
    this.store.select(getAuthenticatedUser)
    .subscribe((user: User) => {
      this.user = user;
    });
  }
  ngOnInit() {
    const applicationId = Number(this.route.snapshot.params['tenantId']);
    const baseHref = this.router.url.split('/').slice(0, 5).join('/');
    const configId = this.router.url.split('/')[4];
    // we get the config id, by id to prevent XSS, so we don't inject the string directly in the DOM from the url
    const config = this.appConfigService.config.services.find((x) => x.id === configId);
    const serviceId = config.id;
    const html = `<e2e-${serviceId}-management-app id="service-component" application-id="${applicationId}" base-href="${baseHref}" user-identity="${this.user.id}" user-authorization="Token ${this.userService.getToken()}"></e2e-${serviceId}-management-app>`;
    this.componentHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }
  @HostListener('window:beforeunload')
  canDeactivate() {
    let serviceComponent = document.getElementById("service-component") as any;
    return serviceComponent.canDeactivate();
  }
}
