import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription, Subject } from 'rxjs';

import {
  State,
  TransactionContentEdit,
  getContentEditState,
  ApplicationContent,
  getDataTypes,
  DataType
} from '@forge/core';
import { FieldConfig } from '@forge/shared';
import { NotifierService } from 'angular-notifier';
import { takeUntil, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'fge-content-inline-editor',
  templateUrl: './content-inline-editor.component.html'
})
export class ContentInlineEditorComponent implements OnInit, OnDestroy {

  @Input() contentData: ApplicationContent;
  @Input() config: FieldConfig;

  private routeParamsSubscription: Subscription;
  private applicationId: string;
  private groupId: string;
  private unsubscribeEdition = new Subject();
  private isAliveComponent = true;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private notifierService: NotifierService
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
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.routeParamsSubscription.unsubscribe();
    this.unsubscribeEdition.complete();
  }

  handleActions(): void {
    const value = '';
    const { id: contentId, status: status } = this.contentData;
    const contentPayload = {
      status,
      value
    };
    this.store.dispatch(new TransactionContentEdit({
      applicationId: this.applicationId,
      groupId: this.groupId,
      contentId,
      contentPayload,
    }));
    this.store.select(getContentEditState);
  }

  handleSubmit({ value: formData, success, error}): void {
    let value = formData[this.config.name];
    const { id: contentId, status: status } = this.contentData;
    if (this.config.type === 'image' || this.config.type === 'document') {
      value = formData[this.config.name].formattedValue;
    }
    const contentPayload = {
      status,
      value
    };
    this.store.dispatch(new TransactionContentEdit({
      applicationId: this.applicationId,
      groupId: this.groupId,
      contentId,
      contentPayload,
    }));
    this.store.select(getContentEditState)
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

  private handleDataTypes(dataTypes$: Observable<DataType[]>) {
    dataTypes$.pipe(takeWhile(() => this.isAliveComponent))
    .subscribe((types: DataType[]) => {
      const appDataType = types.find((dataType: DataType) => dataType.name === 'Logo Display');
      this.config.options = appDataType.values;
    });
  }
}
