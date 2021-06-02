import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormBuilder, ValidatorFn, FormControl } from '@angular/forms';

import { FieldConfig } from '../models/field-config.model';

@Component({
  exportAs: 'fgeDynamicInlineForm',
  selector: 'fge-dynamic-inline-form',
  templateUrl: './dynamic-inline-form.component.html'
})
export class DynamicInlineFormComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() config: FieldConfig;
  @Output() readonly onsubmit: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  errors: string[];
  message: string;
  loadingAsyncResponse: boolean;
  fieldChanged: boolean;

  get changes() {
    return this.form.valueChanges;
  }
  get valid() {
    return this.form.valid;
  }
  get value() {
    return this.form.value;
  }
  get currentForm() {
    return this.form;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.createGroup();
  }

  ngOnChanges() {
    if (this.form) {
      /* istanbul ignore next */
      this.form.addControl(this.config.name, this.createControl(this.config));
    }
  }

  ngAfterViewInit() {
    this.changes.subscribe(() => {
      this.verifyChanges();
      if (this.form.valid) {
        this.setDisabled('save', false);
      }
    });
  }

  createGroup() {
    const group = this.fb.group({});
    group.addControl(this.config.name, this.createControl(this.config));
    return group;
  }

  createControl(config: FieldConfig) {
    const { disabled, validation, value } = config;
    return this.fb.control({ disabled, value }, this.getValidators(validation));
  }

  handleSubmit(event?: Event) {
    if (this.form.valid) {
      this.resetAsyncFlags();
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.onsubmit.emit({
        value: this.value,
        success: this.asyncSuccess.bind(this),
        error: this.asyncError.bind(this)
      });
    } else {
      this.validateAllFormFields();
      this.setDisabled('save', !this.form.valid);
    }
  }

  handleCancel(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.setValue(this.config.name, this.config.value);
  }

  asyncSuccess() {
    this.loadingAsyncResponse = false;
    this.fieldChanged = false;
  }

  asyncError(errorMsg: string[]) {
    this.loadingAsyncResponse = false;
    this.errors = errorMsg;
  }

  private setDisabled(name: string, disable: boolean) {
    if (this.form.controls[name]) {
      const method = disable ? 'disable' : 'enable';
      this.form.controls[name][method]();
      return;
    }
    this.config.disabled = disable;
  }

  private setValue(name: string, value: any) {
    this.form.controls[name].setValue(value, { emitEvent: true });
  }

  private resetAsyncFlags() {
    this.loadingAsyncResponse = true;
    this.errors = null;
  }

  private getValidators(validationConfig: any): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    Object.keys(validationConfig).forEach(validatorKey => {
      validators.push(validationConfig[validatorKey].validator);
    });
    return validators;
  }

  private verifyChanges(): void {
    if (this.config.type === 'select') {
      this.handleSubmit();
    } else {
      this.fieldChanged = this.form.value[this.config.name] !== this.config.value;
    }
  }

  validateAllFormFields(formGroup?: FormGroup) {
    const currentGroup = formGroup || this.form;
    Object.keys(currentGroup.controls).forEach(field => {
      const control = currentGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
