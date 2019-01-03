import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';
import _clone from 'lodash/clone';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  State,
  getApplicationInfo,
  Application,
  FetchContentGroups,
  ContentGroup,
  ContentGroupRecordTransaction,
  getContentGroupState,
  FgeModalService
 } from '@forge/core';
import { FieldConfig } from '@forge/shared';
import { configGroupFields } from './group-form-modal.config';

@Component({
  selector: 'fge-group-form-modal',
  templateUrl: './group-form-modal.component.html',
})
export class GroupFormModalComponent implements OnInit, OnDestroy {

  @ViewChild('modalTemplate') modalContent: ElementRef;

  submitted = false;
  loading = false;
  mode: 'CREATE' | 'EDIT';
  config: FieldConfig[];

  private applicationId: string | number;
  private appInfoSubscription: Subscription;
  private contentGroup: ContentGroup;
  private unsubscribeModal = new Subject();

  constructor(
    private modalService: FgeModalService,
    private store: Store<State>,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.initSelectors();
  }

  ngOnDestroy() {
    this.appInfoSubscription.unsubscribe();
  }

  open(contentGroup: ContentGroup): void {
    this.contentGroup = contentGroup;
    this.mode = contentGroup ? 'EDIT' : 'CREATE';
    configGroupFields[0].value = this.mode === 'EDIT' ? contentGroup.name : '';
    this.config = _clone(configGroupFields);
    this.modalService.open(this.modalContent);
  }

  onSubmit({ value: formData, success, error}): void {
    this.submitted = true;
    if (this.mode === 'EDIT') {
      this.updateContentGroup(formData);
    } else {
      this.addContentGroup(formData);
    }

    this.store.select(getContentGroupState)
      .pipe(takeUntil(this.unsubscribeModal))
      .subscribe((recordState) => {
        const { error: errorData, loading } = recordState;
        if (errorData) {
          const errors = Object.values(errorData.error.error.fields);
          if (error.status !== 400) {
            this.notifierService.notify('error', 'Whoops, something went wrong!. Please try again later.');
          }
          this.unsubscribeModal.next();
          error(errors);
        } else if (!loading) {
          this.loading = false;
          this.store.dispatch(new FetchContentGroups({ applicationId: this.applicationId }));
          this.notifierService.notify('success', this.getNotificationMsg());
          this.unsubscribeModal.next();
          success();
          this.modalService.dismissAll();
        }
      });
  }

  handleCancel(event: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.modalService.dismissAll();
  }

  private addContentGroup(formData: any): void {
    const payload = {
      applicationId: this.applicationId,
      groupName: formData.groupName
    };
    this.store.dispatch(new ContentGroupRecordTransaction(payload, 'POST' ));
  }

  private updateContentGroup(formData: any): void {
    const payload = {
      id: this.contentGroup,
      applicationId: this.applicationId,
      groupName: formData.groupName
    };
    this.store.dispatch(new ContentGroupRecordTransaction(payload, 'PUT' ));
  }

  private initSelectors(): void {
    this.appInfoSubscription = this.store.select(getApplicationInfo)
      .subscribe((applicationInfo: Application) => {
        if (applicationInfo) {
          this.applicationId = applicationInfo.id;
        }
      });
  }

  private getNotificationMsg(): string {
    return this.mode === 'EDIT' ?
      'The content group has been updated successfully' :
      'The content group has been created successfully';
  }
}
