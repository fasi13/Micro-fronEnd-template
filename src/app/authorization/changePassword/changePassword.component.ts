import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'fge-change-password',
    templateUrl: './changePassword.component.html'
})
export class ChangePasswordComponent implements OnInit {
    changePasswordForm: FormGroup;
    submitted = false;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.changePasswordForm = this.formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
        }, { validator: this.checkPasswords });
    }

    checkPasswords(group: FormGroup) {
        const newPassword = group.controls.newPassword.value;
        const confirmNewPassword = group.controls.confirmNewPassword.value;
        return newPassword === confirmNewPassword ? null : { notSame: true };
    }

    get currentPassword() { return this.changePasswordForm.get('currentPassword'); }

    get newPassword() { return this.changePasswordForm.get('newPassword'); }

    get confirmNewPassword() { return this.changePasswordForm.get('confirmNewPassword'); }

    onSubmit() {
        this.submitted = true;
    }
}
