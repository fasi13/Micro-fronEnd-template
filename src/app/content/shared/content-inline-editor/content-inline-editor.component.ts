
import { Component, OnInit, OnDestroy, Input, ViewChild, EventEmitter, NgZone, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import _assign from 'lodash/assign';
import _clone from 'lodash/clone';
import _find from 'lodash/find';
import _includes from 'lodash/includes';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  State,
  LinkContentAction,
  getContentActionState,
  ApplicationContent,
  Link,
  FgeModalService
} from '@forge/core';
import { FieldConfig, ModalConfirmComponent } from '@forge/shared';
import { dataTypes } from '../content-form-modal/content-data-types.config';
import { ContentEditorModalComponent } from '../content-editor-modal/content-editor-modal.component';
import { ModalConfirmConfig } from '../../../shared/components/modal-confirm/modal-confirm.model';
import { ContentEditorConfigurationService } from 'src/app/core/services/content-editor-configuration.service';
import { ContentEditorConfiguration, ContentEditorOnSaveEvent, ContentEditorSaveActionEvent, ContentEditorSetValueActionEvent } from '@e2e/content-management-components';

@Component({
  selector: 'fge-content-inline-editor',
  templateUrl: './content-inline-editor.component.html'
})
export class ContentInlineEditorComponent implements OnInit, OnDestroy {

  @Input() contentData: ApplicationContent;
  @Input() config: FieldConfig;
  @ViewChild('confirmModal') confirmModal: ModalConfirmComponent;
  @ViewChild('copyConfirmModal') copyConfirmModal: ModalConfirmComponent;

  configConfirmModal: ModalConfirmConfig;
  e2eContentEditorConfig: ContentEditorConfiguration;
  save = new EventEmitter<ContentEditorSaveActionEvent>();
  setValue = new EventEmitter<ContentEditorSetValueActionEvent>();

  private routeParamsSubscription: Subscription;
  private applicationId: string;
  private groupId: string;
  private unsubscribeEdition = new Subject();
  private modalRef: NgbModalRef;
  private currentLink: Link;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private modalService: NgbModal,
    private fgeModalService: FgeModalService,
    private contentEditorConfigurationService: ContentEditorConfigurationService,
    private zone: NgZone,
  ) { }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params
      .subscribe(params => {
        this.applicationId = params['tenantId'];
        this.groupId = params['groupId'];
        this.e2eContentEditorConfig = this.contentEditorConfigurationService.get(this.applicationId);
      });
  }

 onSave(event: {detail: ContentEditorOnSaveEvent}) {
    const component = this;
    event.detail.promise.then(function(success) {
      if (!success) { return; }
      component.zone.run(() => {
        component.notifierService.notify('success', `The content "${component.contentData.name}" has been updated successfully`);
      });
    });
  }

  ngOnDestroy() {
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
        message: `Are you sure you want to ${this.currentLink.name.toLowerCase()} for the content "${this.config.label}"?`,
        submitLabel: 'Accept',
        cancelLabel: 'Cancel'
      };
      this.confirmModal.open();
    }
  }

}

// tslint:disable-next-line:max-classes-per-file
@Pipe({
  name: 'showLink',
  pure: false
})
export class ShowLinkPipe implements PipeTransform {
  relsToShow = ['updateContentDescription', 'inheritContentValue', 'clearContentValue'];
  transform(items: Link[]): Link[] {
      if (!items) {
          return items;
      }
      return items.filter((link: Link) => _includes(this.relsToShow, link.rel));
  }
}
