import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import _find from 'lodash/find';
import _assign from 'lodash/assign';
import _clone from 'lodash/clone';

import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import {
  State,
  FetchContentGroup,
  getGroup,
  FetchContent,
  getContent,
  isLoadingGroup,
  ContentGroup,
  ApplicationContent,
  FgeRouterService,
  Link
} from '@forge/core';
import { ContentFormModalComponent } from '../shared/content-form-modal/content-form-modal.component';
import { dataTypes as availableDataTypes } from '../shared/content-form-modal/content-data-types.config';
import { FieldConfig } from '@forge/shared';

@Component({
  selector: 'fge-group-details',
  templateUrl: './group-details.component.html'
})
export class GroupDetailsComponent implements OnInit, OnDestroy {

  currentGroup: ContentGroup;
  loading$: Observable<boolean> | boolean;
  editMode: boolean;
  editableContents: any;
  applicationId: number;
  adaContent: string;

  private isAliveComponent = true;
  private modalRef: NgbModalRef;

  get contentsAsList() {
    if (this.currentGroup) {
      return this.currentGroup.content.filter((content: ApplicationContent) => content.displayAsList);
    }
    return [];
  }

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private modalService: NgbModal,
    private fgeRouter: FgeRouterService
  ) { }

  ngOnInit() {
    this.editMode = true;
    this.route.params
      .subscribe(params => this.initDispatchers(params));
    this.initSelectors();
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  parseToDate(strDate: string): Date {
    return new Date(strDate);
  }

  openContentForm(): void {
    this.modalRef = this.modalService.open(ContentFormModalComponent, { windowClass: 'modal-content-form' });
    this.modalRef.componentInstance.groupId = this.currentGroup.id;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  goToContentEdit(contentId: string): void {
    this.fgeRouter.navigate(`content/group/${this.currentGroup.id}/content/${contentId}/edit`);
  }

  private initDispatchers({ tenantId: applicationId, groupId }: any): void {
    this.store.dispatch(new FetchContentGroup({ applicationId, groupId }));
    this.applicationId = applicationId;
  }

  private initSelectors(): void {
    this.loading$ = this.store.select(isLoadingGroup);
    this.store.select(getGroup)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((group: ContentGroup) => {
        this.currentGroup = group;
        if (group) {
          this.initEditableFields();
          this.initAdaDispatcher();
        }
      });
  }

  private initEditableFields(): void {
    this.editableContents = this.currentGroup.content
      .filter((content: ApplicationContent) => !content.displayAsList)
      .map((content: ApplicationContent) => {
        const fieldConfig: FieldConfig = _assign(_clone(availableDataTypes[content.dataType.name]), { label: content.name });
        return {
          config: fieldConfig,
          contentData: content
        };
      });
  }

  private initAdaDispatcher(): void {
    const { href }: Link = _find(this.currentGroup._links, ['rel', 'supportingContent']) || {};
    if (href) {
      const splittedUrl = href.split('/');
      const contentId = + splittedUrl[splittedUrl.length - 1];
      const applicationId = this.applicationId;
      this.store.dispatch(new FetchContent({ applicationId, contentId }));
      this.initAdaContent();
    } else {
      this.adaContent = '';
    }
  }

  private initAdaContent(): void {
    this.store.select(getContent)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((content: ApplicationContent) => {
        if (content) {
          this.adaContent = content.value;
        }
      });
  }
}
