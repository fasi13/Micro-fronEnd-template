import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import {
  State,
  getGroups,
  FgeRouterService,
  isLoadingGroups,
  ContentGroup
} from '@forge/core';
import {
  UserPrefenceService,
  PreferenceType
} from 'src/app/core/services/user-prefence.service';

@Component({
  selector: 'fge-groups-listing',
  templateUrl: './groups-listing.component.html',
})
export class GroupsListingComponent implements OnInit {

  groups$: Observable<ContentGroup[]>;
  loading$: Observable<boolean> | boolean;
  displayMode: string;

  constructor(
    private store: Store<State>,
    private fgeRouter: FgeRouterService,
    private userPreference: UserPrefenceService
  ) { }

  ngOnInit() {
    this.initSelectors();
    this.userPreference.getPreference(PreferenceType.GROUP_LISTING_VIEW)
      .subscribe((value: string) => {
        this.displayMode = value || 'list';
      });
  }

  goToContentGroup(groupId: string): void {
    this.fgeRouter.navigate(`content/group/${groupId}`);
  }

  updatePreference(displayMode: string): void {
    this.userPreference.upsertPreference(PreferenceType.GROUP_LISTING_VIEW, displayMode);
  }

  private initSelectors() {
    this.loading$ = this.store.select(isLoadingGroups);
    this.groups$ = this.store.select(getGroups);
  }

}
