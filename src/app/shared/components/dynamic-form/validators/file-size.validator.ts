import { AbstractControl } from '@angular/forms';

export function ValidateFileSize(control: AbstractControl) {
  const file = control.value;
  if (file) {
    const fileSize = Math.round(file.size / Math.pow(1024, 2));
    if (fileSize > 3) {
      return { fileSize: true };
    }
  }
  return null;
}
