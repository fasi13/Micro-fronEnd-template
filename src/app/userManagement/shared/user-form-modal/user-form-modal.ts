import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewUser, NewUserAction } from '@forge/core';
// import { State, isNewUserCreated, getNewUserError } from '../../../core/store/store.reducers';
import { State, UserService } from '@forge/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { createSecureServer } from 'http2';

@Component({
    selector: 'fge-user-form-modal',
    templateUrl: './user-form-modal.component.html'
})

export class UserFormModalComponent implements OnInit, OnDestroy {
    @ViewChild('modalTemplate')
    modalContent: ElementRef;
    createCompleted: boolean;
    userForm: FormGroup;
    mode: 'CREATE' | 'EDIT';
    applicationID: number;
    loading: Observable<boolean> | boolean = false;
    // private isAliveComponent = true;

    constructor(
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private store: Store<State>,
        private userService: UserService,
        private notifierService: NotifierService) { }

    ngOnInit() {
        this.createCompleted = false;
        this.userForm = this.formBuilder.group({
            userName: [ '', Validators.required ],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
            email: [ '', [Validators.required, Validators.email]],
            status: ['', Validators.required]
        });

        // this.store.select(isNewUserCreated)
        // .pipe(
        //     takeWhile(() => this.isAliveComponent),
        //     filter(isReseted => isReseted)
        // )
        // .subscribe(() => {
        //     this.notifierService.notify('success', this.getNotificationMsg());
        //     this.userForm.reset();
        //     this.createCompleted = true;
        //     this.loading = false;
        // });
    }

    ngOnDestroy() {
        // this.isAliveComponent = false;
    }

    open(): void {
        this.mode = 'CREATE';
        this.modalService.open(this.modalContent);
      }

    onApplicationId(applicationId: number): void {
        this.applicationID = applicationId;
    }

     onSubmit(closeModal: Function) {
        this.createCompleted = false;
        this.loading = true;
        this.createUser(closeModal);
    //  this.store.dispatch(new NewUserAction(payload));
    }

    private createUser(closeModal: Function): void {
        const payload: NewUser = {
            userName: this.userForm.value.userName,
            firstName: this.userForm.value.firstName,
            lastName: this.userForm.value.lastName,
            emailAddress: this.userForm.value.email,
            status: this.userForm.value.status,
            applicationId: this.applicationID,
            password: this.userForm.value.password
        };
        this.userService.createNewUser(payload)
            .subscribe(...(this.subscriptionHandlers(closeModal)));
    }

    private subscriptionHandlers(closeModal: Function): any[] {
        return [
            () => {
                if (closeModal) {
                    closeModal();
                }
                this.loading = false;
                // this.store.dispatch(new FetchContentGroups({ applicationId: this.applicationId }));
                this.notifierService.notify('success', this.getNotificationMsg());
            },
            (error) => {
                this.loading = false;
                if (error.status === 400) {
                    this.notifierService.notify('error', 'Whoops, something went wrong!. Please try again later.')
                }
            }
        ];
    }

    private getNotificationMsg(): string {
        return this.mode === 'EDIT' ?
          'The user has been updated successfully' :
          'The new user has been created successfully';
    }

    checkPasswords(group: FormGroup) {
        const password = group.controls.password.value;
        const confirmPassword = group.controls.confirmPassword.value;
        return password === confirmPassword ? null : { notSame: true };
    }

    get userName() { return this.userForm.get('userName'); }
    get firstName() { return this.userForm.get('firstName'); }
    get lastName() { return this.userForm.get('lastName'); }
    get email() { return this.userForm.get('email'); }
    get status() { return this.userForm.get('status'); }
    get applicationId() { return this.userForm.get('applicationId'); }
    get password() { return this.userForm.get('password'); }
    get confirmPassword() { return this.userForm.get('confirmPassword'); }
}
