import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../app-config.service';
@Component({
  selector: 'fge-service',
  templateUrl: './service.component.html'
})
export class ServiceComponent implements OnInit  {
  componentHtml: SafeHtml;
  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private appConfigService: AppConfigService) {}
  ngOnInit() {
    let applicationId = Number(this.route.snapshot.params['tenantId']);
    let baseHref = this.router.url.split('/').slice(0, 5).join("/");
    let configId = this.router.url.split('/')[4];
    // we get the config id, by id to prevent XSS, so we don't inject the string directly in the DOM from the url
    let config = this.appConfigService.config.services.find((x) => x.id == configId);
    let serviceId = config.id;
    let html = `<e2e-${serviceId}-management-app application-id="${applicationId}" base-href="${baseHref}"></e2e-${serviceId}-management-app>`
    this.componentHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
