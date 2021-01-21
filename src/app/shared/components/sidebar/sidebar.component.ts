import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs';

import {
  State,
  isLoadingGroups,
  getGroups,
  FgeRouterService,
  ContentGroup
} from '@forge/core';
import { AppConfigService, IServiceConfig } from 'src/app/app-config.service';

@Component({
  selector: 'fge-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  @Input() active = true;
  loading$: Observable<boolean> | boolean;
  contentGroups$: Observable<ContentGroup[]>;
  services: IServiceConfig[];

  private activatedSection;

  constructor(
    private store: Store<State>,
    private fgeRouter: FgeRouterService,
    private ngRouter: Router,
    private appConfigService: AppConfigService
  ) {}

  ngOnInit() {
    this.initRouteHandler();
    this.initSelectors();
    this.services = this.appConfigService.config.services;
  }

  onToggleSidebar() {
    this.active = !this.active;
  }

  goToContentGroup(groupId: string): void {
    this.fgeRouter.navigate(`content/group/${groupId}`);
  }

  goToContentGroups(event: Event): void {
    event.stopPropagation();
    this.fgeRouter.navigate(`content/groups`);
  }

  goToUsersManagement(): void {
    this.fgeRouter.navigate(`user`);
  }

  goToUserRoles(): void {
    this.fgeRouter.navigate(`user/roles`);
  }

  goToPromotions(): void {
    this.fgeRouter.navigate(`promotions`);
  }

  goToService(id): void {
    this.fgeRouter.navigate(`service/${id}`);
  }

  goToCampaings(): void {
    this.fgeRouter.navigate(`campaings`);
  }

  goToSettings(): void {
    this.fgeRouter.navigate(`settings`);
  }

  goToReports(): void {
    this.fgeRouter.navigate(`report`);
  }

  isSectionActive(sectionName: string): boolean {
    return this.activatedSection === sectionName;
  }

  private initSelectors(): void {
    this.loading$ = this.store.select(isLoadingGroups);
    this.contentGroups$ = this.store.select(getGroups);
  }

  private initRouteHandler(): void {
    this.setActivatedSection();
    this.ngRouter.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.setActivatedSection();
      }
    });
  }

  private setActivatedSection() {
    const url = this.ngRouter.url;
    const portions = url.split('/');
    if (portions) {
      this.activatedSection = portions[3];
    }
  }
}
