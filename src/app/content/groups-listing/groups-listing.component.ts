import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, getGroups, ApplicationContent, FgeRouterService, isLoadingGroups } from '@forge/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'fge-groups-listing',
  templateUrl: './groups-listing.component.html',
})
export class GroupsListingComponent implements OnInit {

  groups$: Observable<ApplicationContent[]>;
  loading$: Observable<boolean> | boolean;
  displayMode = 'grid';

  constructor(
    private store: Store<State>,
    private fgeRouter: FgeRouterService
  ) { }

  ngOnInit() {
    this.initSelectors();
  }

  goToContentGroup(groupId: string): void {
    this.fgeRouter.navigate(`content/group/${groupId}`);
  }

  private initSelectors() {
    this.loading$ = this.store.select(isLoadingGroups);
    this.groups$ = this.store.select(getGroups);
  }

}
