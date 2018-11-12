import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import _clone from 'lodash/clone';
import { Store } from '@ngrx/store';
import { takeWhile, filter } from 'rxjs/operators';

import {
    State,
    isUserUpdated,
    UpdateUserAction } from '@forge/core';

@Component({
    selector: 'fge-user-form-modal',
    templateUrl: './modal-confirm.component.html'
})

export class UserFormModalComponent {
    @ViewChild('modalTemplate') modalContent: ElementRef;

    label: string;
    user: any;
    private isAliveComponent = true;

    constructor(
        private modalService: NgbModal,
        private store: Store<State>,
        ) { }

    open(user: any): void {
        this.user = user;
        this.label = user.isActive ? 'Desactive' : 'Active';
        this.handleUpdateUser();
        this.modalService.open(this.modalContent);
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

    submit(): void {
        this.store.dispatch(new UpdateUserAction({
            id: this.user.userId,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            emailAddress: this.user.emailAddress,
            isActive: !this.user.activeUser,
        }));
    }
}
