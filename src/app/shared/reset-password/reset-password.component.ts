import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'fge-reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    submitted = false;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.resetPasswordForm = this.formBuilder.group({
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

    get currentPassword() { return this.resetPasswordForm.get('currentPassword'); }

    get newPassword() { return this.resetPasswordForm.get('newPassword'); }

    get confirmNewPassword() { return this.resetPasswordForm.get('confirmNewPassword'); }

    onSubmit() {
        this.submitted = true;
        console.log('try to submit.');
    }
}
