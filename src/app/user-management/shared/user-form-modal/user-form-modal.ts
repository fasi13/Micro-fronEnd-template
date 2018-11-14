import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import _clone from 'lodash/clone';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeWhile, filter } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';

import {
    NewUser,
    NewUserAction,
    State,
    areUsersFetching,
    UpdateUserAction } from '@forge/core';

import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { config as fieldConfiguration } from './user-form-modal.config';
import { configUpdate as fieldUpdateConfiguration } from './user-form-update-modal.config';

@Component({
    selector: 'fge-user-form-modal',
    templateUrl: './user-form-modal.component.html'
})

export class UserFormModalComponent implements OnDestroy {
    @ViewChild('modalTemplate') modalContent: ElementRef;
    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    mode: 'CREATE' | 'EDIT';
    applicationID: number;
    user: any;
    config: FieldConfig[];
    private success: any;
    private isAliveComponent = true;

    constructor(
        private modalService: NgbModal,
        private store: Store<State>,
        private route: ActivatedRoute,
        ) { }

    ngOnDestroy() {
        this.isAliveComponent = false;
    }

    open(user: any): void {
        this.mode = user ? 'EDIT' : 'CREATE';
        if (user) {
            this.user = user;
            fieldUpdateConfiguration[0].value = user.firstName;
            fieldUpdateConfiguration[1].value = user.lastName;
            fieldUpdateConfiguration[2].value = user.email;
            fieldUpdateConfiguration[3].value = user.isActive;
            this.applicationID = user.applicationId;
            this.config = _clone(fieldUpdateConfiguration);
        } else {
            this.user = {};
            this.user.applicationName = '';
            fieldConfiguration[2].validation.matchPassword.validator = this.validateMatchPassword;
            this.config = _clone(fieldConfiguration);
            this.setCurrentApplicationId();
        }
        this.handleUser();
        this.modalService.open(this.modalContent);
    }

    private handleUser(): void {
        this.store.select(areUsersFetching)
        .pipe(
            takeWhile(() => this.isAliveComponent),
            filter(areUsersFetching => areUsersFetching),
        )
        .subscribe(() => {
            this.success();
            this.modalService.dismissAll();
        });
    }

    submit({ value: formData, success }): void {
        this.success = success;
        if (this.mode === 'CREATE') {
            const payload: NewUser = {
                userName: formData.userName,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                emailAddress: formData.emailAddress,
                isActive: formData.activeUser,
                applicationId: this.applicationID
            };
            this.store.dispatch(new NewUserAction(payload));
        } else {
            this.store.dispatch(new UpdateUserAction({
                id: this.user.id,
                firstName: formData.firstName,
                lastName: formData.lastName,
                emailAddress: formData.emailAddress,
                isActive: formData.activeUser,
            }));
        }
    }

    handleCancel() {
        this.modalService.dismissAll();
    }

    private setCurrentApplicationId(): void {
        this.applicationID = +this.route.params['value'].tenantId;
    }

    validateMatchPassword(control: AbstractControl) {
        if (control.value) {
            const result = control.parent.controls['password'].value !== control.value;
            return { matchPassword: result };
        }
        return null;
    }
}
