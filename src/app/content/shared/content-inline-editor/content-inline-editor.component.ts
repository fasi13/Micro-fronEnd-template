import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import {
  State,
  TransactionContentEdit,
  getContentEditState,
  ApplicationContent,
  getDataTypes,
  DataType
} from '@forge/core';
import { DynamicInlineFormComponent, FieldConfig } from '@forge/shared';

@Component({
  selector: 'fge-content-inline-editor',
  templateUrl: './content-inline-editor.component.html'
})
export class ContentInlineEditorComponent implements OnInit, OnDestroy {

  @Input() contentData: ApplicationContent;
  @Input() config: FieldConfig;
  @ViewChild(DynamicInlineFormComponent) form: ElementRef;

  loading$: Observable<boolean> | boolean;

  private routeParamsSubscription: Subscription;
  private applicationId: string;
  private groupId: string;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
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
    this.routeParamsSubscription.unsubscribe();
  }

  handleCancel(): void {
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
      .subscribe((editState) => {
        const { error: errorData, loading } = editState;
        if (errorData) {
          const errors = Object.values(errorData.error.fields);
          error(errors);
        } else if (!loading) {
          success();
        }
      });
  }

  private handleDataTypes(dataTypes$: Observable<DataType[]>) {
    dataTypes$.subscribe((types: DataType[]) => {
      const appDataType = types.find((dataType: DataType) => dataType.name === 'Logo Display');
      this.config.options = appDataType.values;
    });
  }

}
