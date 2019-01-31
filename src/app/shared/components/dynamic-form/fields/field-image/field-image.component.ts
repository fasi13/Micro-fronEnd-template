import { Component, ChangeDetectorRef } from '@angular/core';
import _assign from 'lodash/assign';
import _clone from 'lodash/clone';

import { FormField } from '../../models/form-field.abstract';

@Component({
  selector: 'fge-field-image',
  templateUrl: './field-image.component.html'
})
export class FieldImageComponent extends FormField {

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if (this.isValidFileExtension(file.name)) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          const newValue = {};
          newValue[`${this.config.name}`] = reader.result;
          const fileContent = (reader.result as String).split(',')[1];
          const value = _assign(file, { formattedValue: `${file.name}:${fileContent}` });
          this.group.controls[this.config.name]['fileValue'] = value;
          this.changeDetector.markForCheck();
        };
      }
    }
  }

  private isValidFileExtension(fileName: string): boolean {
    const fileExt = fileName.substr(fileName.lastIndexOf('.') + 1);
    return /(png|\jpg|\jpeg|svg|\gif)$/i.test(fileExt);
  }
}
