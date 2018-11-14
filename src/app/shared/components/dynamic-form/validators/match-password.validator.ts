import { AbstractControl } from '@angular/forms';

export function ValidateMatchPassword(fieldNameToCompare: string) {
    return (control: AbstractControl): {[key: string]: any} | null => {
        if (control.value) {
            const field = control.parent.controls[fieldNameToCompare];
            if (field.value !== control.value) {
                return { matchPassword: true };
            }
        }
        return null;
    };
}
