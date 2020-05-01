import { ContentVersion } from './../../../core/models/content/content-version';
import { VersionHistoryModalComponent } from './../version-history-modal/version-history-modal.component';
import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import _assign from 'lodash/assign';
import _clone from 'lodash/clone';
import _find from 'lodash/find';
import _includes from 'lodash/includes';

import { Observable, Subscription, Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

import {
  State,
  LinkContentAction,
  getContentActionState,
  ApplicationContent,
  getDataTypes,
  DataType,
  Link,
  FgeModalService
} from '@forge/core';
import { FieldConfig, ModalConfirmComponent, DynamicInlineFormComponent } from '@forge/shared';
import { dataTypes } from '../content-form-modal/content-data-types.config';
import { ContentEditorModalComponent } from '../content-editor-modal/content-editor-modal.component';
import { ModalConfirmConfig } from '../../../shared/components/modal-confirm/modal-confirm.model';

@Component({
  selector: 'fge-content-inline-editor',
  templateUrl: './content-inline-editor.component.html'
})
export class ContentInlineEditorComponent implements OnInit, OnDestroy {

  @Input() contentData: ApplicationContent;
  @Input() config: FieldConfig;
  @ViewChild(DynamicInlineFormComponent) form: DynamicInlineFormComponent;
  @ViewChild('confirmModal') confirmModal: ModalConfirmComponent;
  @ViewChild('copyConfirmModal') copyConfirmModal: ModalConfirmComponent;


  linkActions: Link[];
  configConfirmModal: ModalConfirmConfig;

  private routeParamsSubscription: Subscription;
  private applicationId: string;
  private groupId: string;
  private unsubscribeEdition = new Subject();
  private isAliveComponent = true;
  private modalRef: NgbModalRef;
  private currentLink: Link;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private modalService: NgbModal,
    private fgeModalService: FgeModalService
  ) { }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params
      .subscribe(params => {
        this.applicationId = params['tenantId'];
        this.groupId = params['groupId'];
      });
    if (this.config.type === 'image' || this.config.type === 'document') {
      this.config.src = this.contentData.value;
      const fieldSource = this.config.src.split('/');
      this.config.filename = fieldSource[fieldSource.length - 1];
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
    if (link.rel === 'updateContentDescription') {
      this.openContentEditorModal('Text', 'description', link);
    } else {
      this.currentLink = link;
      this.openModalConfirm();
    }
  }

  handleSubmit({ value: formData, success, error}): void {
    let value = formData[this.config.name];
    if (this.config.type === 'image' || this.config.type === 'document') {
      value = this.form.form.controls[this.config.name]['fileValue']['formattedValue'];
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

  onSubmitConfirmModal() {
    switch (this.currentLink.rel) {
      case 'clearContentValue':
        this.dispatchContentAction(this.currentLink, { value: '' });
        this.selectContentAction({ success: 'cleaned', error: 'cleaning' });
        break;
      case 'inheritContentValue':
        this.dispatchContentAction(this.currentLink, { value: null });
        this.selectContentAction({ success: 'restored', error: 'restoring' });
        break;
    }
    this.confirmModal.close();
  }

  openVersionHistory(): void {
    this.modalRef = this.modalService.open(VersionHistoryModalComponent, { windowClass: 'modal-content-form' });
    this.modalRef.componentInstance.contentData = this.contentData;
    this.modalRef.componentInstance.form = this.form.form;
    this.modalRef.componentInstance.config = this.config;
    this.fgeModalService.registerModal(this.modalRef);
    this.modalRef.result.then((contentVersion: ContentVersion) => {
    if (!contentVersion) {return; }
    if (this.form.form.value[this.config.name] !== this.contentData.value) {
        this.configConfirmModal = {
          title: 'Copy confirmation',
          message: 'Are you sure you want to copy the content? Your latest changes will be overridden.',
          submitLabel: 'Accept',
          cancelLabel: 'Cancel',
        };
        this.copyConfirmModal.onsubmit.subscribe(() => {
        this.form.form.patchValue({[this.form.config.name]: contentVersion.value});
        this.copyConfirmModal.close();
        });
        this.copyConfirmModal.open();
    } else {
      this.form.form.patchValue({[this.form.config.name]: contentVersion.value});
    }
    });
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
      if (types) {
        const appDataType = types.find((dataType: DataType) => dataType.name === 'Logo Display');
        this.config.options = appDataType.values;
      }
    });
  }

  private filterActionTypes() {
    const relsToShow = ['updateContentDescription', 'inheritContentValue', 'clearContentValue'];
    this.linkActions = this.contentData._links.filter((link: Link) => _includes(relsToShow, link.rel));
  }

  private openContentEditorModal(dataType: string, fieldToEdit: string, link: Link): void {
    this.modalRef = this.modalService.open(ContentEditorModalComponent);
    this.modalRef.componentInstance.content = this.contentData;
    this.modalRef.componentInstance.link = link;
    this.modalRef.componentInstance.groupId = this.groupId;
    this.modalRef.componentInstance.config = _assign(_clone(dataTypes[dataType]), { label: fieldToEdit });
    this.fgeModalService.registerModal(this.modalRef);
  }

  private openModalConfirm(): void {
    if (this.currentLink && this.config ) {
      this.configConfirmModal = {
        title: 'Action confirmation',
        message: `Are you sure you want to ${this.currentLink.name.toLowerCase()} the content "${this.config.label}"?`,
        submitLabel: 'Accept',
        cancelLabel: 'Cancel'
      };
      this.confirmModal.open();
    }
  }

}
