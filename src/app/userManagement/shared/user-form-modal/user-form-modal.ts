import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { UserResetPassword, ResetpasswordAction } from '@forge/core';
// import { State, isReseted, getResetPasswordError } from '../../core/store/store.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';

@Component({
    selector: 'fge-user-form-modal',
    templateUrl: './user-form-modal.component.html'
})

export class UserFormModalComponent implements OnInit, OnDestroy {
    @ViewChild('modalTemplate')
    modalContent: ElementRef;
    resetCompleted: boolean;
    userForm: FormGroup;
    mode: 'CREATE' | 'EDIT';
    applicationId: number;
    private isAliveComponent = true;
    // userResetPassword: UserResetPassword;
    regexp = '(?=(.*[A-Z0-9$@$!%*#?&]){2})[A-Za-z0-9$@$!%*#?&]{6,}';

    constructor(private modalService: NgbModal, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.resetCompleted = false;
        this.userForm = this.formBuilder.group({
            userName: [ '', Validators.required ],
            firstName: [''],
            lastName: [''],
            email: [ '', Validators.required, Validators.email ],
            status: ['']
        });

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

    open(): void {
        // this.contentGroup = contentGroup;
        // this.mode = contentGroup ? 'EDIT' : 'CREATE';
        // const name = this.mode === 'EDIT' ? contentGroup.name : '';
        // this.groupForm = this.formBuilder.group({
        //   name: [name, Validators.compose([Validators.required, Validators.minLength(3)])]
        // });
        this.mode = 'CREATE';
        this.modalService.open(this.modalContent);
      }

    onApplicationId(applicationId: number): void {
        this.applicationId = applicationId;
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
