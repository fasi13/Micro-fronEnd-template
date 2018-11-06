import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import _clone from 'lodash/clone';
// import { NewUser, UpdateUser } from '@forge/core';
// import { State, isNewUserCreated, getNewUserError } from '../../../core/store/store.reducers';

// import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
// import { takeWhile, filter } from 'rxjs/operators';
// import { NotifierService } from 'angular-notifier';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { config as fieldConfiguration } from './user-form-modal.config';


@Component({
    selector: 'fge-user-form-modal',
    templateUrl: './user-form-modal.component.html'
})

export class UserFormModalComponent implements OnInit, OnDestroy {
    @ViewChild('modalTemplate') modalContent: ElementRef;
    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    createCompleted: boolean;
    mode: 'CREATE' | 'EDIT';
    applicationID: number;
    loading: Observable<boolean> | boolean = false;
    user: any;
    config: FieldConfig[];

    constructor(
        private modalService: NgbModal,
        // public activeModal: NgbActiveModal,
        // private store: Store<State>,
        // private store: Store<State>,
        // private notifierService: NotifierService
        ) { }

    ngOnInit() {
      this.config = _clone(fieldConfiguration);
    }

    ngOnDestroy() {
        // this.isAliveComponent = false;
    }

    open(user: any): void {
        this.mode = user ? 'EDIT' : 'CREATE';
        if (user) {
            this.user = user;
            // this.userForm.value.userName = user.userName;
            // const status = user.status === 'active';
            this.applicationID = user.applicationId;
        } else {
            this.user = {};
            this.user.applicationName = '';
        }
        this.modalService.open(this.modalContent);
      }

    onApplicationId(applicationId: number): void {
        this.applicationID = applicationId;
    }

    submit(something: any): void {
        console.log(something);
    }

    // onSubmit(closeModal: Function) {
    //     this.createCompleted = false;
    //     this.loading = true;
    //     // if (this.mode === 'EDIT') {
    //     //     this.updateUser(closeModal);
    //     // } else {
    //     //     this.createUser(closeModal);
    //     // }
    // }

    // private createUser(closeModal: Function): void {
    //     const payload: NewUser = {
    //     };
    //     this.userService.createNewUser(payload)
    //         .subscribe(...(this.subscriptionHandlers(closeModal)));
    // }

    // private updateUser(closeModal: Function): void {
    //     const payload: UpdateUser = {
    //         id: this.user.userId,
    //         firstName: this.userForm.value.firstName,
    //         lastName: this.userForm.value.lastName,
    //         emailAddress: this.userForm.value.email,
    //         isActive: this.userForm.value.status,
    //         applicationId: this.applicationID,
    //     };
    //     this.userService.updetedUser(payload)
    //         .subscribe(...(this.subscriptionHandlers(closeModal)));
    // }

    // private subscriptionHandlers(closeModal: Function): any[] {
    //     return [
    //         () => {
    //             if (closeModal) {
    //                 closeModal();
    //             }
    //             this.loading = false;
    //             this.notifierService.notify('success', this.getNotificationMsg());
    //         },
    //         (error) => {
    //             this.loading = false;
    //             if (error.status === 400) {
    //                 this.notifierService.notify('error', 'Whoops, something went wrong!. Please try again later.');
    //             }
    //         }
    //     ];
    // }

    // private getNotificationMsg(): string {
    //     return this.mode === 'EDIT' ?
    //       'The user has been updated successfully' :
    //       'The new user has been created successfully';
    // }

    // checkPasswords(group: FormGroup) {
    //     const password = group.controls.password.value;
    //     const confirmPassword = group.controls.confirmPassword.value;
    //     return password === confirmPassword ? null : { notSame: true };
    // }
}
