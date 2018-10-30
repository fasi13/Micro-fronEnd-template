import { ValidatorFn } from '@angular/forms';

export class FieldConfig {
  disabled?: boolean;
  label?: string;
  name: string;
  options?: string[];
  placeholder?: string;
  type: string;
  value?: any;
  validation?: { [key: string]: { errorMsg: string, validator: ValidatorFn }};
}