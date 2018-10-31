import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { State, getApplicationInfo, Application, getDataTypes, DataType, AddContent } from '@forge/core';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { config as FieldConfiguration } from './content-fields-modal.config';
import { ContentDataType, dataTypes as AvailableDataTypes } from './content-data-types.config';

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

  private currentType: string;
  private applicationDataTypes: DataType[];
  private config: FieldConfig[];
  private dataTypes: ContentDataType;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<State>,
  ) { }

  ngOnInit() {
    this.config = FieldConfiguration;
    this.dataTypes = AvailableDataTypes;
    this.initSelectors();
  }

  ngAfterViewInit() {
    let previousValid = this.form.valid;
    this.form.changes.subscribe(({ type }) => {
      this.switchDataType(type);
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('save', !previousValid);
      }
    });
  }

  submit({ name, description, type: typeStr, textValue: value }: any): void {
    const { id: applicationId } = this.applicationInfo;
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

  private handleApplicationInfo(appInfo$: Observable<Application>) {
    appInfo$.subscribe((applicationInfo: Application) => this.applicationInfo = applicationInfo);
  }

  private switchDataType(type: string): void {
    if (this.currentType) {
      this.config[this.config.length - 2] = this.dataTypes[type];
    } else {
      this.config.splice(this.config.length - 1, 0, this.dataTypes[`${type}`]);
    }
    this.config = Array.from(this.config);
    this.currentType = type;
  }
}
