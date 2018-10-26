import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription, Observable } from 'rxjs';

import { State, FetchContentGroup, getGroup, ApplicationContent, isLoadingGroup, ContentGroup } from '@forge/core';
import { takeWhile } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ContentFormModalComponent } from '../shared/content-form-modal/content-form-modal.component';

@Component({
  selector: 'fge-group-details',
  templateUrl: './group-details.component.html'
})
export class GroupDetailsComponent implements OnInit, OnDestroy {

  currentGroup: ContentGroup;
  loading$: Observable<boolean> | boolean;

  private routeParamsSubscription: Subscription;
  private isAliveComponent = true;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params
      .subscribe(params => this.initDispatchers(params));
    this.initSelectors();
  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
    this.isAliveComponent = false;
  }

  parseToDate(strDate: string): Date {
    return new Date(strDate);
  }

  openContentForm(): void {
    const modalRef: NgbModalRef = this.modalService.open(ContentFormModalComponent);
  }

  private initDispatchers({ tenantId: applicationId, groupId }: any): void {
    this.store.dispatch(new FetchContentGroup({ applicationId, groupId }))    
  }

  private initSelectors(): void {
    this.loading$ = this.store.select(isLoadingGroup);
    this.store.select(getGroup)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((group: ContentGroup) => this.currentGroup = group);
  }

}
