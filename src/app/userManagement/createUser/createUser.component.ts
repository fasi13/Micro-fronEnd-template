import { Component, OnInit, OnDestroy } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { UserResetPassword, ResetpasswordAction } from '@forge/core';
// import { State, isReseted, getResetPasswordError } from '../../core/store/store.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';

@Component({
    selector: 'fge-create-user',
    templateUrl: './createUser.component.html'
})

export class CreateUserComponent implements OnInit, OnDestroy {
    // createUserForm: FormGroup;
    resetCompleted: boolean;
    private isAliveComponent = true;
    // userResetPassword: UserResetPassword;
    regexp = '(?=(.*[A-Z0-9$@$!%*#?&]){2})[A-Za-z0-9$@$!%*#?&]{6,}';

    // constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.resetCompleted = false;
        // this.createUserForm = this.formBuilder.group({
        //     userName: [ '', Validators.required ] ,
        //     email: [ '', Validators.required, Validators.email ]
        // });

        // this.store.select(isReseted)
        // .pipe(
        //     takeWhile(() => this.isAliveComponent),
        //     filter(isReseted => isReseted)
        // )
        // .subscribe(() => {
        //     this.resetPasswordForm.reset();
        //     this.resetCompleted = true;
        // });
    }

    ngOnDestroy() {
        this.isAliveComponent = false;
    }

    // get currentPassword() { return this.resetPasswordForm.get('currentPassword'); }

    // get newPassword() { return this.resetPasswordForm.get('newPassword'); }

    // get confirmNewPassword() { return this.resetPasswordForm.get('confirmNewPassword'); }

    // onSubmit() {
    //     this.resetCompleted = false;
    //     const payload: UserResetPassword = {
    //         newPassword: this.resetPasswordForm.value.newPassword,
    //         oldPassword: this.resetPasswordForm.value.currentPassword
    //     };
    //     this.store.dispatch(new ResetpasswordAction(payload));
    // }
}
