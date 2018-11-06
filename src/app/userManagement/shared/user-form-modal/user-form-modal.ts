import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewUser, UpdateUser } from '@forge/core';
// import { State, isNewUserCreated, getNewUserError } from '../../../core/store/store.reducers';
import { UserService } from '@forge/core';

// import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
// import { takeWhile, filter } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';

@Component({
    selector: 'fge-user-form-modal',
    templateUrl: './user-form-modal.component.html'
})

export class UserFormModalComponent implements OnInit, OnDestroy {
    @ViewChild('modalTemplate') modalContent: ElementRef;
    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    createCompleted: boolean;
    userForm: FormGroup;
    mode: 'CREATE' | 'EDIT';
    applicationID: number;
    loading: Observable<boolean> | boolean = false;
    user: any;
    config: FieldConfig[] = [
      {
        type: 'text',
        label: 'UserName',
        name: 'userName',
        placeholder: 'Enter userName',
        validation: {
          required: {
            errorMsg: 'UserName is required',
            validator: Validators.required
          },
          minlength: {
            errorMsg: 'Name should have at least 2 characters',
            validator: Validators.minLength(2)
          },
          maxlength: {
            errorMsg: 'Name should not have more than 15 characters',
            validator: Validators.maxLength(15)
          }
        }
      },
      {
        type: 'password',
        label: 'Password',
        name: 'password',
        placeholder: 'Enter password',
        validation: {
          required: {
            errorMsg: 'Password is required',
            validator: Validators.required
          },
          minlength: {
            errorMsg: 'Description should have at least 6 characters',
            validator: Validators.minLength(6)
          }
        }
      },
      {
        type: 'password',
        label: 'Confirm Password',
        name: 'confirmPassword',
        placeholder: 'Enter confirm password',
        validation: {
          required: {
            errorMsg: 'Confirm password is required',
            validator: Validators.required
          },
          minlength: {
            errorMsg: 'Description should have at least 6 characters',
            validator: Validators.minLength(6)
          }
        }
      },
      {
        type: 'text',
        label: 'First Name',
        name: 'firstName',
        placeholder: 'Enter first name',
        validation: {
          required: {
            errorMsg: 'First name is required',
            validator: Validators.required
          },
          minlength: {
            errorMsg: 'Name should have at least 2 characters',
            validator: Validators.minLength(2)
          },
          maxlength: {
            errorMsg: 'Name should not have more than 15 characters',
            validator: Validators.maxLength(15)
          }
        }
      },
      {
        type: 'text',
        label: 'Last Name',
        name: 'lastName',
        placeholder: 'Enter last name',
        validation: {
          required: {
            errorMsg: 'Last name is required',
            validator: Validators.required
          },
          minlength: {
            errorMsg: 'Name should have at least 2 characters',
            validator: Validators.minLength(2)
          },
          maxlength: {
            errorMsg: 'Name should not have more than 15 characters',
            validator: Validators.maxLength(15)
          }
        }
      },
      {
        type: 'email',
        label: 'Email address',
        name: 'emailAddress',
        placeholder: 'Enter email address',
        validation: {
          required: {
            errorMsg: 'Email address is required',
            validator: Validators.required
          },
          email: {
            errorMsg: 'Please enter a valid Email address',
            validator: Validators.email
          }
        }
      },
      {
        type: 'checkbox',
        label: 'Active user',
        name: 'activeUser',
        validation: {}
      },
      {
        label: 'Save',
        name: 'save',
        type: 'button'
      }
    ];

    constructor(
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        // private store: Store<State>,
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
    }

    ngOnDestroy() {
        // this.isAliveComponent = false;
    }

    open(user: any): void {
        this.mode = user ? 'EDIT' : 'CREATE';
        if (user) {
            this.user = user;
            this.userForm.value.userName = user.userName;
            const status = user.status === 'active';
            this.userForm = this.formBuilder.group({
                firstName: [user.firstName, Validators.required],
                lastName: [user.lastName, Validators.required],
                email: [ user.email, [Validators.required, Validators.email]],
                status: [status, Validators.required]
            });
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

    onSubmit(closeModal: Function) {
        this.createCompleted = false;
        this.loading = true;
        if (this.mode === 'EDIT') {
            this.updateUser(closeModal);
        } else {
            this.createUser(closeModal);
        }
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

    private updateUser(closeModal: Function): void {
        const payload: UpdateUser = {
            id: this.user.userId,
            firstName: this.userForm.value.firstName,
            lastName: this.userForm.value.lastName,
            emailAddress: this.userForm.value.email,
            isActive: this.userForm.value.status,
            applicationId: this.applicationID,
        };
        this.userService.updetedUser(payload)
            .subscribe(...(this.subscriptionHandlers(closeModal)));
    }

    private subscriptionHandlers(closeModal: Function): any[] {
        return [
            () => {
                if (closeModal) {
                    closeModal();
                }
                this.loading = false;
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
