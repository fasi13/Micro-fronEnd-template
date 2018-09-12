import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserResetPassword, ResetpasswordAction } from '@forge/core';
import { isAuthenticationLoading, State, isReseted, getResetPasswordError } from '../../core/store/store.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';

@Component({
    selector: 'fge-reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    resetPasswordForm: FormGroup;
    loading$: Observable<boolean> | boolean = false;
    private isAliveComponent = true;
    userResetPassword: UserResetPassword;

    constructor(private formBuilder: FormBuilder, private store: Store<State>) { }

    ngOnInit() {
        this.resetPasswordForm = this.formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
        }, { validator: this.checkPasswords });

        this.store.select(getResetPasswordError)
        .pipe(
            takeWhile(() => this.isAliveComponent)
        )
        .subscribe((error) => {
            console.log('error : (', error);
        });
        this.store.select(isReseted)
        .pipe(
            takeWhile(() => this.isAliveComponent),
            filter(isReseted => isReseted)
        )
        .subscribe(() => {
            console.log('etro');
        });
    }

    ngOnDestroy() {
        this.isAliveComponent = false;
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
        const payload = {
            newPassword: this.newPassword(),
            oldPassword: this.currentPassword()
        };
        this.store.dispatch(new ResetpasswordAction(payload));
    }
}
