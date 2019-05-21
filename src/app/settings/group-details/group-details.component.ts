import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { takeWhile } from 'rxjs/operators';

import {
  State,
  FgeHttpActionService,
  SettingGroupLink,
  getSettingGroup,
  Setting
} from '@forge/core';
import { ModalConfirmConfig } from 'src/app/shared/components/modal-confirm/modal-confirm.model';
import { FetchSettingGroup } from 'src/app/core/store/settings';

@Component({
  selector: 'fge-group-details',
  templateUrl: './group-details.component.html'
})
export class GroupDetailsComponent implements OnInit, OnDestroy {

  groupState: any;
  sort: { sortby: string, sortdirection: 'asc' | 'desc' };
  config: ModalConfirmConfig;

  private isAliveComponent = true;
  private filters: { [key: string]: string };
  private confirmModal: any;
  private selectedSetting: Setting;
  private id: string;

  constructor(
    private store: Store<State>,
    private fgeActionService: FgeHttpActionService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.params.subscribe( params => {
      const { groupId: id } = params;
      if (id) {
        this.initDefaultFilterSorting();
        this.initSelectors();
        const { filters, sort } = this;
        this.id = id;
        this.store.dispatch(new FetchSettingGroup({ id, filters, sort }));
      }
    });
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  onPerformFilter(): void {
    const { filters, sort, id } = this;
    this.store.dispatch(new FetchSettingGroup({ id, filters, sort }));
  }

  onResetFilters(): void {
    this.filters = {};
    this.sort = {
      sortby: 'name',
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
    const { sort, filters, id } = this;
    this.store.dispatch(new FetchSettingGroup({ id, sort, filters }));
  }

  trackByGroupId(_index, item: any): number {
    return item.id;
  }

  onPageChange(index: number): void {
    const { limit } = this.groupState;
    const offset = (index - 1) * limit;
    const { sort, filters, id } = this;
    this.store.dispatch(new FetchSettingGroup({ id, offset, limit, filters, sort }));
    window.scrollTo(0, 0);
  }

  onTransactionCompleted(): void {
    this.initDefaultFilterSorting();
    this.onPageChange(1);
  }

  openModalConfirm(confirmModal: any, selectedSetting: Setting): void {
    this.confirmModal = confirmModal;
    this.selectedSetting = selectedSetting;
    this.config = {
      title: 'Delete Setting',
      message: `Do you want to delete the Setting "${selectedSetting.name}"`,
      submitLabel: 'Accept',
      cancelLabel: 'Cancel'
    };
    confirmModal.open();
  }

  onSubmitConfirmModal() {
    this.fgeActionService.performAction(this.selectedSetting, SettingGroupLink.DELETE_SETTING_GROUP)
      .subscribe(() => this.confirmModal.close());
  }

  private initSelectors() {
    this.store.pipe(
      select(getSettingGroup),
      takeWhile(() => this.isAliveComponent)
    )
    .subscribe((state) => this.groupState = state);
  }

  private initDefaultFilterSorting() {
    this.sort = {
      sortby: 'name',
      sortdirection: 'asc'
    };
    this.filters = {};
  }
}
