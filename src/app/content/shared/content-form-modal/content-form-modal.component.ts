import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';

import { Observable } from 'rxjs';

import { State, getApplicationInfo, Application, getGroup, ContentGroup, getDataTypes, DataType } from '@forge/core';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';

@Component({
  selector: 'fge-content-form-modal',
  templateUrl: './content-form-modal.component.html'
})
export class ContentFormModalComponent implements OnInit, AfterViewInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  mode: 'CREATE' | 'EDIT' = 'CREATE';
  config: FieldConfig[] = [
    {
      type: 'text',
      label: 'Name',
      name: 'name',
      placeholder: 'Enter name',
      validation: {
        required: {
          errorMsg: 'Name is required',
          validator: Validators.required
        },
        minlength: {
          errorMsg: 'Name should have at least 2 characters',
          validator: Validators.minLength(2)
        },
        maxlength: {
          errorMsg: 'Name should not have more than 15 characters',
          validator: Validators.maxLength(15)
        }
      }
    },
    {
      type: 'text',
      label: 'Description',
      name: 'description',
      placeholder: 'Enter description',
      validation: {
        required: {
          errorMsg: 'Description is required',
          validator: Validators.required
        },
        minlength: {
          errorMsg: 'Description should have at least 2 characters',
          validator: Validators.minLength(2)
        }
      }
    },
    {
      type: 'select',
      label: 'Data Type',
      name: 'type',
      options: [],
      placeholder: 'Select Data Type',
      validation: {
        required: {
          errorMsg: 'Please select a Data Type',
          validator: Validators.required
        },
      }
    },
    {
      label: 'Save',
      name: 'save',
      type: 'button'
    }
  ];

  dataTypes: {[key: string]: FieldConfig} = {
    'Text': {
      type: 'text',
      label: 'Value',
      name: 'textValue',
      placeholder: 'Enter value',
      validation: {
        required: {
          errorMsg: 'Value is required',
          validator: Validators.required
        },
        minlength: {
          errorMsg: 'Value should have at least 2 characters',
          validator: Validators.minLength(2)
        }
      }
    }
  };
  public info$: Observable<Application>;
  public group$: Observable<ContentGroup>;

  private currentType: string;

  constructor(
    public activeModal: NgbActiveModal,
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

  submit(formData: any): void {
    console.log(formData);
    this.activeModal.close();
    this.notifierService.notify('success', 'The content has been created successfully');
  }

  private initSelectors(): void {
    this.info$ = this.store.select(getApplicationInfo);
    this.group$ = this.store.select(getGroup);
    this.store.select(getDataTypes)
      .subscribe((dataTypes: DataType[]) => {
        const selectConfigIndex = this.config.findIndex((config: FieldConfig) => config.name === 'type');
        this.config[selectConfigIndex].options = dataTypes.map((dataType: DataType) => dataType.name);
      });
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
