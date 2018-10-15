import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, isLoadingGroups, getGroups, ApplicationContent, FgeRouterService } from '@forge/core';
import { FetchContentGroups } from '../../../core/store/content';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'fge-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  @Input()
  active: boolean = true;
  loading$: Observable<boolean> | boolean;
  contentGroups$: Observable<ApplicationContent[]>;

  private isAliveComponent = true;
  private activatedSection;

  constructor(
    private store: Store<State>,
    private fgeRouter: FgeRouterService,
    private ngRouter: Router
  ) { }

  ngOnInit() {
    this.initRouteHandler();
    this.initSelectors();
  }

  onToggleSidebar() {
    this.active = !this.active;
  }

  goToContentGroup(groupId: string): void {
    this.fgeRouter.navigate(`content/group/${groupId}`);
  }

  goToContentGroups(): void {
    this.fgeRouter.navigate(`content/groups`);
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
    this.ngRouter.events.subscribe((value) => {
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
