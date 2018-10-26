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
import { FormButtonComponent } from '../inputs/form-button/form-button.component';
import { FormTextComponent } from '../inputs/form-text/form-text.component';
import { FormSelectComponent } from '../inputs/form-select/form-select.component';
import { FormImageComponent } from '../inputs/form-image/form-image.component';
import { FormDocumentComponent } from '../inputs/form-document/form-document.component';
import { FormColorComponent } from '../inputs/form-color/form-color.component';

const components: {[type: string]: Type<Field>} = {
  button: FormButtonComponent,
  text: FormTextComponent,
  select: FormSelectComponent,
  image: FormImageComponent,
  document: FormDocumentComponent,
  color: FormColorComponent
};

@Directive({
  selector: '[fgeDynamicField]'
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit {
  @Input()
  config: FieldConfig;

  @Input()
  group: FormGroup;

  component: ComponentRef<Field>;

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
    const component = this.resolver.resolveComponentFactory<Field>(components[this.config.type]);
    this.component = this.container.createComponent(component);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }
}