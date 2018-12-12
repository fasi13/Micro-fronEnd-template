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
import _compact from 'lodash/compact';
import _includes from 'lodash/includes';

import { FieldConfig } from './models/field-config.model';

@Component({
  exportAs: 'fgeDynamicForm',
  selector: 'fge-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnChanges, OnInit, AfterViewInit {
  @Input()
  set fieldsConfig(newConfig) {
    this.config = _compact(newConfig);
  }
  get fieldsConfig() {
    return this.config;
  }
  @Output() readonly onsubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() readonly oncancel: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  errors: string[];
  loadingAsyncResponse: boolean;

  get controls(): any {
    return this.config.filter((fieldConfig: FieldConfig) => fieldConfig && fieldConfig.type !== 'button');
  }
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

  config: FieldConfig[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.createGroup();
  }

  ngOnChanges() {
    if (this.form) {
      const controls = Object.keys(this.form.controls);
      const configControls = this.controls.map(item => item.name);

      controls
        .filter(control => !_includes(configControls, control))
        .forEach(control => this.form.removeControl(control));

      configControls
        .filter(control => !_includes(controls, control))
        .forEach(name => {
          const config = this.config.find(control => control.name === name);
          this.form.addControl(name, this.createControl(config));
        });
    }
  }

  ngAfterViewInit() {
    this.changes.subscribe(() => {
      if (this.form.valid) {
        this.setDisabled('save', false);
      }
    });
  }

  createGroup() {
    const group = this.fb.group({});
    this.controls.forEach(control =>
      group.addControl(control.name, this.createControl(control))
    );
    return group;
  }

  createControl(config: FieldConfig) {
    const { disabled, validation, value } = config;
    return this.fb.control({ disabled, value }, this.getValidators(validation));
  }

  handleSubmit(event: Event) {
    if (this.form.valid) {
      this.resetAsyncFlags();
      event.preventDefault();
      event.stopPropagation();
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
    this.oncancel.emit();
  }

  asyncSuccess() {
    this.loadingAsyncResponse = false;
  }

  asyncError(errorMsg: string[]) {
    this.loadingAsyncResponse = false;
    this.errors = errorMsg;
  }

  setDisabled(name: string, disable: boolean) {
    if (this.form.controls[name]) {
      const method = disable ? 'disable' : 'enable';
      this.form.controls[name][method]();
      return;
    }

    this.config = this.config.map(item => {
      if (item.name === name) {
        item.disabled = disable;
      }
      return item;
    });
  }

  setValue(name: string, value: any) {
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
