import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FieldConfig } from 'src/app/shared/components/dynamic-form/models/field-config.model';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/dynamic-form.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'fge-content-form-modal',
  templateUrl: './content-form-modal.component.html'
})
export class ContentFormModalComponent implements AfterViewInit {

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
      name: 'textValuee',
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

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngAfterViewInit() {
    let previousValid = this.form.valid;
    this.form.changes.subscribe(({ type }) => {
      this.switchDataType(type);
      console.log(this.form.controls);
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('save', !previousValid);
      }
    });
  }

  submit(event: Event): void {
    console.log(event);
  }

  private switchDataType(type: string): void {
    if (this.currentType) {
      this.config[this.config.length - 2] = this.dataTypes[type];
    } else {
      this.config.splice(this.config.length - 1, 0, this.dataTypes[`${type}`]);
    }
    this.currentType = type;
  }
}
