import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewUser, NewUserAction } from '@forge/core';
import { State, isNewUserCreated, getNewUserError } from '../../../core/store/store.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

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
    applicationId: number;
    private isAliveComponent = true;

    constructor(
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private store: Store<State>,
        private notifierService: NotifierService) { }

    ngOnInit() {
        this.createCompleted = false;
        this.userForm = this.formBuilder.group({
            userName: [ '', Validators.required ],
            firstName: [''],
            lastName: [''],
            email: [ '', Validators.required, Validators.email ],
            status: ['']
        });

        this.store.select(isNewUserCreated)
        .pipe(
            takeWhile(() => this.isAliveComponent),
            filter(isReseted => isReseted)
        )
        .subscribe(() => {
            this.notifierService.notify('success', this.getNotificationMsg());
            this.userForm.reset();
            this.createCompleted = true;
        });
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

     onSubmit() {
        this.createCompleted = false;
        const payload: NewUser = {
            login: this.userForm.value.userName,
            firstName: this.userForm.value.firstName,
            lastName: this.userForm.value.lastName,
            emailAddress: this.userForm.value.email,
            status: this.userForm.value.status,
            applicationId: this.applicationId
        };
        this.store.dispatch(new NewUserAction(payload));
    }
    private getNotificationMsg(): string {
        return this.mode === 'EDIT' ?
          'The content group has been updated successfully' :
          'The new user has been created successfully';
      }
}
