import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import _clone from 'lodash/clone';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeWhile, filter } from 'rxjs/operators';

import {
    NewUser,
    NewUserAction,
    State,
    isNewUserCreated,
    isUserUpdated,
    UpdateUserAction } from '@forge/core';

import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { config as fieldConfiguration } from './user-form-modal.config';
import { configUpdate as fieldUpdateConfiguration } from './user-form-update-modal.config';

@Component({
    selector: 'fge-user-form-modal',
    templateUrl: './user-form-modal.component.html'
})

export class UserFormModalComponent {
    @ViewChild('modalTemplate') modalContent: ElementRef;
    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    mode: 'CREATE' | 'EDIT';
    applicationID: number;
    user: any;
    config: FieldConfig[];
    private isAliveComponent = true;

    constructor(
        private modalService: NgbModal,
        private store: Store<State>,
        private route: ActivatedRoute,
        ) { }

    open(user: any): void {
        this.mode = user ? 'EDIT' : 'CREATE';
        if (user) {
            this.user = user;
            fieldUpdateConfiguration[0].value = user.firstName;
            fieldUpdateConfiguration[1].value = user.lastName;
            fieldUpdateConfiguration[2].value = user.email;
            fieldUpdateConfiguration[3].value = user.status;
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
            filter(isNewUserCreated => isNewUserCreated),
        )
        .subscribe((response) => {
            console.log(response);
            this.modalService.dismissAll();
        });
    }

    private handleUpdateUser(): void {
        this.store.select(isUserUpdated)
        .pipe(
            takeWhile(() => this.isAliveComponent),
            filter(isUserUpdated => isUserUpdated),
        )
        .subscribe(() => {
            this.modalService.dismissAll();
        });
    }

    submit(userForm: any): void {
        if (this.mode === 'CREATE') {
            const payload: NewUser = {
                userName: userForm.userName,
                password: userForm.password,
                firstName: userForm.firstName,
                lastName: userForm.lastName,
                emailAddress: userForm.emailAddress,
                isActive: userForm.activeUser,
                applicationId: this.applicationID
            };
            this.store.dispatch(new NewUserAction(payload));
        } else {
            this.store.dispatch(new UpdateUserAction({
                id: this.user.userId,
                firstName: userForm.firstName,
                lastName: userForm.lastName,
                emailAddress: userForm.emailAddress,
                isActive: userForm.activeUser,
            }));
        }
    }

    private setCurrentApplicationId(): void {
        this.applicationID = +this.route.params['value'].tenantId;
    }
}
