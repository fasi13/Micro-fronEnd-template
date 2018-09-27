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
  contentGroups: ApplicationContent[];

  private isAliveComponent = true;
  private activatedSection;

  constructor(
    private store: Store<State>,
    private fgeRouter: FgeRouterService,
    private ngRouter: Router
  ) { }

  ngOnInit() {
    this.setActivatedSection();
    this.store.dispatch(new FetchContentGroups());
    this.loading$ = this.store.select(isLoadingGroups);
    this.store.select(getGroups)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((response: ApplicationContent[]) => this.contentGroups = response);
    this.ngRouter.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.setActivatedSection();
      }
    })
  }

  onToggleSidebar() {
    this.active = !this.active;
  }

  goToContentGroup(groupId: string): void {
    this.fgeRouter.navigate(`content/group/${groupId}`);
  }

  goToContentGroups(groupId: string): void {
    this.fgeRouter.navigate(`content/groups`);
  }

  isSectionActive(sectionName: string): boolean {
    return this.activatedSection === sectionName;
  }

  private setActivatedSection() {
    const url = this.ngRouter.url;
    const portions = url.split('/');
    if (portions) {
      this.activatedSection = portions[3];
    }
  }

}
