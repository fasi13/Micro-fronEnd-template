import { Component, OnInit, OnDestroy } from '@angular/core';
import { State, getSettingGroups } from '@forge/core';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { FetchSettingGroups } from 'src/app/core/store/settings';

@Component({
  selector: 'fge-groups-listing',
  templateUrl: './groups-listing.component.html'
})
export class GroupsListingComponent implements OnInit, OnDestroy {

  groupsState: any;
  sort: { sortby: string, sortdirection: 'asc' | 'desc' };

  private isAliveComponent = true;
  private filters: { [key: string]: string };

  constructor(
    private store: Store<State>,
  ) { }

  ngOnInit() {
    this.sort = {
      sortby: 'name',
      sortdirection: 'asc'
    };
    this.filters = {};
    this.initSelectors();
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  onPerformFilter(): void {
    const { filters, sort } = this;
    this.store.dispatch(new FetchSettingGroups({ filters, sort }));
  }

  onResetFilters(): void {
    this.filters = {};
    this.sort = {
      sortby: 'login',
      sortdirection: 'asc'
    };
    this.onPerformFilter();
  }

  sortBy(field: string): void {
    if (this.sort.sortby === field) {
      this.sort.sortdirection = this.sort.sortdirection === 'desc' ? 'asc' : 'desc';
    } else {
      this.sort = {
        sortby: field,
        sortdirection: 'asc'
      };
    }
    const { sort, filters } = this;
    this.store.dispatch(new FetchSettingGroups({ sort, filters }));
  }

  trackByGroupId(_index, item: any): number {
    return item.id;
  }

  onPageChange(index: number): void {
    const { limit } = this.groupsState;
    const offset = (index - 1) * limit;
    const { sort, filters } = this;
    this.store.dispatch(new FetchSettingGroups({ offset, limit, filters, sort }));
    window.scrollTo(0, 0);
  }

  private initSelectors() {
    this.store.select(getSettingGroups)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((state) => this.groupsState = state);
  }

}
