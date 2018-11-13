import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import _clone from 'lodash/clone';
import _assign from 'lodash/assign';

import { Observable } from 'rxjs';

import { State, getApplicationInfo, Application, getDataTypes, DataType, AddContent } from '@forge/core';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { config as fieldConfiguration } from './content-fields-modal.config';
import { ContentDataType, dataTypes as availableDataTypes } from './content-data-types.config';

@Component({
  selector: 'fge-content-form-modal',
  templateUrl: './content-form-modal.component.html'
})
export class ContentFormModalComponent implements OnInit, AfterViewInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() groupId: string;

  mode: 'CREATE' | 'EDIT' = 'CREATE';
  applicationInfo: Application;
  config: FieldConfig[];

  private currentType: string;
  private applicationDataTypes: DataType[];
  private dataTypes: ContentDataType;

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

  submit({ name, description, type: typeStr, dynamicValue }: any): void {
    const { id: applicationId } = this.applicationInfo;
    let value = dynamicValue;
    if (typeStr === 'Document' || typeStr === 'Image') {
      value = dynamicValue.formattedValue;
    }
    const contentPayload = {
      name,
      description,
      dataType: this.getDataTypeFor(typeStr),
      value
    };
    this.store.dispatch(new AddContent({
      applicationId,
      groupId: this.groupId,
      contentPayload,
    }));
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
    dataTypes$.subscribe((types: DataType[]) => {
      this.applicationDataTypes = types;
      const selectConfigIndex = this.config.findIndex((fieldConfig: FieldConfig) => fieldConfig.name === 'type');
      this.config[selectConfigIndex].options = types.map((dataType: DataType) => dataType.name);
    });
  }

  private handleApplicationInfo(appInfo$: Observable<Application>): void {
    appInfo$.subscribe((applicationInfo: Application) => this.applicationInfo = applicationInfo);
  }

  private switchDataType(type: string): void {
    if (this.currentType !== type) {
      if (this.currentType) {
        this.config[this.config.length - 2] = this.dataTypes[type];
      } else {
        this.config.splice(this.config.length - 1, 0, this.dataTypes[type]);
      }
      this.populateOptionsFor(type, 'Logo Display');
      this.config = Array.from(this.config);
      this.currentType = type;
      this.resetDynamicField();
    }
  }

  private resetDynamicField() {
    setTimeout(() => {
      const dynamicValueControl = this.form.controls.dynamicValue;
      if (dynamicValueControl) {
        dynamicValueControl.reset();
      }
      this.form.validateAllFormFields();
    }, 0);
  }

  private populateOptionsFor(currentType: string, typeName: string): void {
    if (currentType === typeName) {
      const displayInputIndex = this.config.findIndex((fieldConfig: FieldConfig) => fieldConfig.label === typeName);
      if (displayInputIndex >= 0) {
        const appDataType = this.applicationDataTypes.find((dataType: DataType) => dataType.name === typeName);
        this.config[displayInputIndex].options = appDataType.values;
      }
    }
  }
}
