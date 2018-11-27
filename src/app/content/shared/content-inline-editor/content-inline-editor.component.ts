import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import _assign from 'lodash/assign';
import _clone from 'lodash/clone';
import _find from 'lodash/find';

import { Observable, Subscription, Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

import {
  State,
  LinkContentAction,
  getContentActionState,
  ApplicationContent,
  getDataTypes,
  DataType,
  Link
} from '@forge/core';
import { FieldConfig } from '@forge/shared';
import { dataTypes } from '../content-form-modal/content-data-types.config';
import { ContentEditorModalComponent } from '../content-editor-modal/content-editor-modal.component';

@Component({
  selector: 'fge-content-inline-editor',
  templateUrl: './content-inline-editor.component.html'
})
export class ContentInlineEditorComponent implements OnInit, OnDestroy {

  @Input() contentData: ApplicationContent;
  @Input() config: FieldConfig;

  linkActions: Link[];

  private routeParamsSubscription: Subscription;
  private applicationId: string;
  private groupId: string;
  private unsubscribeEdition = new Subject();
  private isAliveComponent = true;
  private modalRef: NgbModalRef;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params
      .subscribe(params => {
        this.applicationId = params['tenantId'];
        this.groupId = params['groupId'];
      });
    if (this.config.type === 'image' || this.config.type === 'document') {
      this.config.src = this.contentData.value;
      this.config['docName'] = this.contentData.name;
    } else {
      this.config.value = this.contentData.value;
    }
    if (this.config.type === 'select') {
      this.handleDataTypes(this.store.select(getDataTypes));
    }
    this.filterActionTypes();
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.routeParamsSubscription.unsubscribe();
    this.unsubscribeEdition.complete();
  }

  handleActions(link: Link): void {
    switch (link.rel) {
      case 'clearContentValue':
        this.dispatchContentAction(link, { value: '' });
        this.selectContentAction({ success: 'cleaned', error: 'cleaning' });
        break;
      case 'inheritContentValue':
        this.dispatchContentAction(link, { value: null });
        this.selectContentAction({ success: 'restored', error: 'restoring' });
        break;
      case 'updateContentDescription':
        this.openContentEditorModal('Text', 'description', link);
        break;
    }
  }

  handleSubmit({ value: formData, success, error}): void {
    let value = formData[this.config.name];
    if (this.config.type === 'image' || this.config.type === 'document') {
      value = formData[this.config.name].formattedValue;
    }
    const link: Link = _find(this.contentData._links, ['rel', 'updateContentValue']);
    if (link) {
      this.dispatchContentAction(link, { value });
      this.store.select(getContentActionState)
        .pipe(takeUntil(this.unsubscribeEdition))
        .subscribe((editState) => {
          const { error: errorData, loading } = editState;
          if (errorData) {
            const errors = Object.values(errorData.error.fields);
            this.notifierService.notify('error', `There was an error updating the content "${this.config.label}"`);
            this.unsubscribeEdition.next();
            error(errors);
          } else if (!loading) {
            this.notifierService.notify('success', `The content "${this.config.label}" has been updated successfully`);
            this.unsubscribeEdition.next();
            success();
          }
        });
    }
  }

  private dispatchContentAction(link: Link, payload: any) {
    const contentPayload = payload;
    const { status: status } = this.contentData;
    contentPayload['status'] = status;
    this.store.dispatch(new LinkContentAction({
      link,
      contentPayload,
      applicationId: this.applicationId,
      groupId: this.groupId
    }));
  }

  private selectContentAction(message: any) {
    this.store.select(getContentActionState)
      .pipe(takeUntil(this.unsubscribeEdition))
      .subscribe((editState) => {
        const { error: errorData, loading } = editState;
        if (errorData) {
          this.notifierService.notify('error', `There was an error ${message.error} the content "${this.config.label}"`);
          this.unsubscribeEdition.next();
        } else if (!loading) {
          this.notifierService.notify('success', `The content "${this.config.label}" has been ${message.success} successfully`);
          this.unsubscribeEdition.next();
        }
      });
  }

  private handleDataTypes(dataTypes$: Observable<DataType[]>) {
    dataTypes$.pipe(takeWhile(() => this.isAliveComponent))
    .subscribe((types: DataType[]) => {
      const appDataType = types.find((dataType: DataType) => dataType.name === 'Logo Display');
      this.config.options = appDataType.values;
    });
  }

  private filterActionTypes() {
    const relsToShow = ['updateContentDescription', 'inheritContentValue', 'clearContentValue'];
    this.linkActions = this.contentData._links.filter((link: Link) => relsToShow.includes(link.rel));
  }

  private openContentEditorModal(dataType: string, fieldToEdit: string, link: Link): void {
    this.modalRef = this.modalService.open(ContentEditorModalComponent);
    this.modalRef.componentInstance.content = this.contentData;
    this.modalRef.componentInstance.link = link;
    this.modalRef.componentInstance.groupId = this.groupId;
    this.modalRef.componentInstance.config = _assign(_clone(dataTypes[dataType]), { label: fieldToEdit });
  }

}
