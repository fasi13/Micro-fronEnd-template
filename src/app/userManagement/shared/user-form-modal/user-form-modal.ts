import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import _clone from 'lodash/clone';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NewUser, NewUserAction, State, isNewUserCreated, getNewUserError, isUserUpdated, getUserUpdateError } from '@forge/core';
// import { State, getApplicationInfo, Application } from '../../../core/store/store.reducers';

import { Store } from '@ngrx/store';
import { takeWhile, filter } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { config as fieldConfiguration } from './user-form-modal.config';
import { configUpdate as fieldUpdateConfiguration } from './user-form-update-modal.config';

@Component({
    selector: 'fge-user-form-modal',
    templateUrl: './user-form-modal.component.html'
})

export class UserFormModalComponent implements OnInit, OnDestroy {
    @ViewChild('modalTemplate') modalContent: ElementRef;
    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
    private modalRef: NgbModalRef;
    private error: any;
    createCompleted: boolean;
    mode: 'CREATE' | 'EDIT';
    applicationID: number;
    loading: Observable<boolean> | boolean = false;
    user: any;
    config: FieldConfig[];
    private isAliveComponent = true;

    constructor(
        private modalService: NgbModal,
        // public activeModal: NgbActiveModal,
        private store: Store<State>,
        private route: ActivatedRoute,
        // private store: Store<State>,
        private notifierService: NotifierService
        ) { }

    ngOnInit() {
        // this.config = this.mode === 'CREATE' ? _clone(fieldConfiguration) : _clone(fieldUpdateConfiguration);
    }

    ngOnDestroy() {
        // this.isAliveComponent = false;
    }

    open(user: any): void {
        this.mode = user ? 'EDIT' : 'CREATE';
        if (user) {
            this.user = user;
            this.applicationID = user.applicationId;
            this.config = _clone(fieldUpdateConfiguration);
            this.handleUpdateUser();
        } else {
            this.user = {};
            this.user.applicationName = '';
            this.config = _clone(fieldConfiguration);
            this.setCurrentApplicationId();
            this.handleNewUser();
        }
        this.modalService.open(this.modalContent);
    }

    private handleNewUser(): void {
        this.store.select(isNewUserCreated)
        .pipe(
            takeWhile(() => this.isAliveComponent),
            filter(isReseted => isReseted),
        )
        .subscribe(() => {
            this.notifierService.notify('success', this.getNotificationMsg());
            this.createCompleted = true;
            this.subscriptionHandlers();
        });
        this.store.select(getNewUserError)
        .pipe(
            takeWhile(() => this.isAliveComponent)
        )
        .subscribe((error) => {
            this.error = error;
            this.subscriptionHandlers();
        });
    }

    private handleUpdateUser(): void {
        this.store.select(isUserUpdated)
        .pipe(
            takeWhile(() => this.isAliveComponent),
            filter(isReseted => isReseted),
        )
        .subscribe(() => {
            this.notifierService.notify('success', this.getNotificationMsg());
            this.createCompleted = true;
            this.subscriptionHandlers();
        });
        this.store.select(getUserUpdateError)
        .pipe(
            takeWhile(() => this.isAliveComponent)
        )
        .subscribe((error) => {
            this.error = error;
            this.subscriptionHandlers();
        });
    }
    onApplicationId(applicationId: number): void {
        this.applicationID = applicationId;
    }

    submit(userForm: any): void {
        this.createCompleted = false;
        const payload: NewUser = {
            userName: userForm.userName,
            password: userForm.password,
            firstName: userForm.firstName,
            lastName: userForm.lastName,
            emailAddress: userForm.email,
            isActive: userForm.activeUser,
            applicationId: this.applicationID
        };
        this.store.dispatch(new NewUserAction(payload));
    }

    private setCurrentApplicationId(): void {
        this.applicationID = +this.route.params['value'].tenantId;
    }

    private subscriptionHandlers() {
        if (this.createCompleted) {
            this.modalRef.close();
            this.loading = false;
            this.notifierService.notify('success', this.getNotificationMsg());
        } else {
            this.loading = false;
            if (this.error) {
                this.notifierService.notify('error', 'Whoops, something went wrong!. Please try again later.');
            }
        }
    }

    private getNotificationMsg(): string {
        return this.mode === 'EDIT' ?
           'The user has been updated successfully' :
           'The new user has been created successfully';
    }
}
