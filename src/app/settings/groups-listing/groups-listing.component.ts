import { Component, OnInit, OnDestroy } from '@angular/core';
import { State, getSettingGroups, SettingGroup, FgeHttpActionService, SettingGroupLink } from '@forge/core';
import { Store, select } from '@ngrx/store';

import { takeWhile } from 'rxjs/operators';

import { FetchSettingGroups } from 'src/app/core/store/settings';
import { ModalConfirmConfig } from 'src/app/shared/components/modal-confirm/modal-confirm.model';

@Component({
  selector: 'fge-groups-listing',
  templateUrl: './groups-listing.component.html'
})
export class GroupsListingComponent implements OnInit, OnDestroy {

  groupsState: any;
  sort: { sortby: string, sortdirection: 'asc' | 'desc' };
  config: ModalConfirmConfig;

  private isAliveComponent = true;
  private filters: { [key: string]: string };
  private confirmModal: any;
  private selectedSettingGroup: SettingGroup;

  constructor(
    private store: Store<State>,
    private fgeActionService: FgeHttpActionService
  ) { }

  ngOnInit() {
    this.initDefaultFilterSorting();
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

  onTransactionCompleted(): void {
    this.initDefaultFilterSorting();
    this.onPageChange(1);
  }

  openModalConfirm(confirmModal: any, selectedSettingGroup: SettingGroup): void {
    this.confirmModal = confirmModal;
    this.selectedSettingGroup = selectedSettingGroup;
    this.config = {
      title: 'Delete Setting Group',
      message: `Do you want to delete the Setting Group "${selectedSettingGroup.name}"`,
      submitLabel: 'Accept',
      cancelLabel: 'Cancel'
    };
    confirmModal.open();
  }

  onSubmitConfirmModal() {
    this.fgeActionService.performAction(this.selectedSettingGroup, SettingGroupLink.DELETE_SETTING_GROUP)
      .subscribe(() => this.confirmModal.close());
  }

  private initSelectors() {
    this.store.pipe(
      select(getSettingGroups),
      takeWhile(() => this.isAliveComponent)
    )
    .subscribe((state) => this.groupsState = state);
  }

  private initDefaultFilterSorting() {
    this.sort = {
      sortby: 'name',
      sortdirection: 'asc'
    };
    this.filters = {};
  }
}
