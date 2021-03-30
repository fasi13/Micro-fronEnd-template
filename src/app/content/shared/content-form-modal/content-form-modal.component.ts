import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import _clone from 'lodash/clone';
import _assign from 'lodash/assign';

import { Observable, Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

import {
  State,
  getApplicationInfo,
  Application,
  getDataTypes,
  DataType,
  TransactionContentRecord,
  getContentRecordState
} from '@forge/core';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { config as fieldConfiguration } from './content-fields-modal.config';
import { ContentDataType, dataTypes as availableDataTypes } from './content-data-types.config';

@Component({
  selector: 'fge-content-form-modal',
  templateUrl: './content-form-modal.component.html'
})
export class ContentFormModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modalTemplate') modalContent: ElementRef;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() groupId: string;

  mode: 'CREATE' | 'EDIT' = 'CREATE';
  applicationInfo: Application;
  config: FieldConfig[];
  currentType: string;

  private applicationDataTypes: DataType[];
  private dataTypes: ContentDataType;
  private unsubscribeForm = new Subject();
  private isAliveComponent = true;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<State>,
  ) { }

  ngOnInit() {
    this.config = _clone(fieldConfiguration);
    this.dataTypes = availableDataTypes;
    this.initSelectors();
  }

  ngAfterViewInit() {
    this.form.changes.subscribe(({ type }) => {
      this.switchDataType(type);
    });
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.unsubscribeForm.complete();
  }

  handleSubmit({ value: formData, success, error}): void {
    const { name, description, type: typeStr, textValue,
      colorValue, logoValue, htmlValue } = formData;
    const { id: applicationId } = this.applicationInfo;
    let value = textValue || colorValue || logoValue || htmlValue;
    const contentPayload = {
      name,
      description,
      dataType: this.getDataTypeFor(typeStr),
      value
    };
    this.store.dispatch(new TransactionContentRecord({
      applicationId,
      groupId: this.groupId,
      contentPayload,
    }));
    this.store.select(getContentRecordState)
      .pipe(takeUntil(this.unsubscribeForm))
      .subscribe((recordState) => {
        const { error: errorData, loading } = recordState;
        if (errorData) {
          const errors = Object.values(errorData.error.fields);
          this.unsubscribeForm.next();
          error(errors);
        } else if (!loading) {
          this.unsubscribeForm.next();
          success();
          this.activeModal.close();
        }
      });
  }

  handleCancel(): void {
    this.activeModal.close();
  }

  private getDataTypeFor(typeStr: string): DataType {
    return this.applicationDataTypes.find((type: DataType) => type.name === typeStr);
  }

  private initSelectors(): void {
    this.handleApplicationInfo(this.store.select(getApplicationInfo));
    this.handleDataTypes(this.store.select(getDataTypes));
  }

  private handleDataTypes(dataTypes$: Observable<DataType[]>) {
    dataTypes$.pipe(takeWhile(() => this.isAliveComponent))
    .subscribe((types: DataType[]) => {
      this.applicationDataTypes = types;
      const selectConfigIndex = this.config.findIndex((fieldConfig: FieldConfig) => fieldConfig.name === 'type');
      this.config[selectConfigIndex].options = types.map((dataType: DataType) => dataType.name);
    });
  }

  private handleApplicationInfo(appInfo$: Observable<Application>): void {
    appInfo$.pipe(takeWhile(() => this.isAliveComponent))
    .subscribe((applicationInfo: Application) => this.applicationInfo = applicationInfo);
  }

  switchDataType(type: string): void {
    if (type == '') return;
    if (this.currentType !== type) {
      const originalDataType = _assign(_clone(this.dataTypes[type]), { value: '' });
      if (originalDataType.type == 'html')  {
        // we don't want to see html editor on the popup, so we convert it to text and already put a 2 spaces value to make it valid
        originalDataType.type = 'text';
        originalDataType.value = '  ';
      }
      const dataType = {
        label: 'Value',
        type: 'contentEditor',
        validation: {},
        value: '',
        name: 'textValue',
        original: originalDataType,
        applicationId: this.applicationInfo.id,
        triggerSave: null
      };
      if (this.currentType) {
        dataType.triggerSave = this.config[this.config.length - 1].triggerSave;
        this.config[this.config.length - 1] = dataType;
      } else {
        this.config.splice(this.config.length, 0, dataType);
      }
      this.config = _clone(this.config);
      this.currentType = type;
      this.validateForm();
    }
  }

  private validateForm() {
    setTimeout(() => {
      this.form.validateAllFormFields();
    }, 0);
  }
}
