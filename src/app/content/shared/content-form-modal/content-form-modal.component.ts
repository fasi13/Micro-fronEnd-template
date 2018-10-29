import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FieldConfig } from 'src/app/shared/components/dynamic-form/models/field-config.model';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/dynamic-form.component';
import { Validators } from '@angular/forms';
import { ContentService, State, getApplicationInfo, Application, getGroup, ContentGroup, ApplicationContent } from '@forge/core';
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';
import { DataType } from 'src/app/core/models/commons/data-type.model';

@Component({
  selector: 'fge-content-form-modal',
  templateUrl: './content-form-modal.component.html'
})
export class ContentFormModalComponent implements OnInit, AfterViewInit {

  @ViewChild('modalTemplate')
  modalContent: ElementRef;

  mode: 'CREATE' | 'EDIT' = 'CREATE';

  @ViewChild(DynamicFormComponent)
  form: DynamicFormComponent;

  config: FieldConfig[] = [
    {
      type: 'text',
      label: 'Name',
      name: 'name',
      placeholder: 'Enter name',
      validation: [Validators.required, Validators.minLength(4)]
    },
    {
      type: 'text',
      label: 'Description',
      name: 'description',
      placeholder: 'Enter description',
      validation: [Validators.required, Validators.minLength(4)]
    },
    {
      type: 'select',
      label: 'Data Type',
      name: 'type',
      options: ['Text', 'Color Picker', 'HTML', 'Logo Display', 'Image', 'Document'],
      placeholder: 'Select Data Type',
      validation: [Validators.required]
    },
    {
      label: 'Save',
      name: 'save',
      type: 'button'
    }
  ];

  dataTypes: {[key:string]: FieldConfig} = {
    'Text': {
      type: 'text',
      label: 'Value',
      name: 'textValue',
      placeholder: 'Enter value',
      validation: [Validators.required]
    },
    'Image': {
      type: 'image',
      label: 'Value',
      name: 'imageValue',
      placeholder: 'Enter value',
      validation: [Validators.required]
    },
    'Document': {
      type: 'document',
      label: 'Value',
      name: 'documentValue',
      placeholder: 'Enter value',
      validation: [Validators.required]
    },
    'Color Picker': {
      type: 'color',
      label: 'Value',
      name: 'colorValue',
      placeholder: 'Enter value',
      validation: [Validators.required]
    }
  };

  private currentType: string;
  private info: Application;
  private group: ContentGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private contentService: ContentService,
    private store: Store<State>,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
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

  submit({ description, name, value }: ApplicationContent): void {
    this.activeModal.close();
    this.notifierService.notify('success', 'The content has been created successfully');
  }

  private initSelectors(): void {
    this.store.select(getApplicationInfo)
      .subscribe(info => this.info = info);
    this.store.select(getGroup)
      .subscribe(group => this.group = group);
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
