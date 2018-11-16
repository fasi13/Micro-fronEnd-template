import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnInit,
  Type,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldConfig } from '../models/field-config.model';
import { Field } from '../models/field.interface';
import { FormField } from '../models/form-field.abstract';
import { FieldButtonComponent } from '../fields/field-button/field-button.component';
import { FieldTextComponent } from '../fields/field-text/field-text.component';
import { FieldSelectComponent } from '../fields/field-select/field-select.component';
import { FieldImageComponent } from '../fields/field-image/field-image.component';
import { FieldDocumentComponent } from '../fields/field-document/field-document.component';
import { FieldColorComponent } from '../fields/field-color/field-color.component';
import { FieldPasswordComponent } from '../fields/field-password/field-password.component';
import { FieldToggleButtonComponent } from '../fields/field-toggle-button/field-toggle-button.component';
import { FieldHtmlComponent } from '../fields/field-html/field-html.component';
import { FieldSearchApplicationComponent } from '../fields/field-search-application/field-search-application.component';

const components: {[type: string]: Type<FormField>} = {
  button: FieldButtonComponent,
  text: FieldTextComponent,
  select: FieldSelectComponent,
  image: FieldImageComponent,
  document: FieldDocumentComponent,
  color: FieldColorComponent,
  password: FieldPasswordComponent,
  toggleButton: FieldToggleButtonComponent,
  html: FieldHtmlComponent,
  searchApplication: FieldSearchApplicationComponent
};

@Directive({
  selector: '[fgeDynamicField]'
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit {

  @Input() config: FieldConfig;
  @Input() group: FormGroup;

  component: ComponentRef<FormField>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
    }
  }

  ngOnInit() {
    if (!components[this.config.type]) {
      throw new Error(
        `[DF]Unsupported type (${this.config.type}).`
      );
    }
    const component = this.resolver.resolveComponentFactory<FormField>(components[this.config.type]);
    this.component = this.container.createComponent(component);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }
}
