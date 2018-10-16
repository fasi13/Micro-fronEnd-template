import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, getGroups, ApplicationContent, FgeRouterService } from '@forge/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'fge-groups-listing',
  templateUrl: './groups-listing.component.html',
})
export class GroupsListingComponent implements OnInit {

  groups$: Observable<ApplicationContent[]>;

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
    this.groups$ = this.store.select(getGroups);
  }

}
