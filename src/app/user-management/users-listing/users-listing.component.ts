import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
    State,
    UpdateUserAction,
    isUserUpdated,
    isLoadingGroups,
    getGroups,
    ApplicationContent, } from '@forge/core';

@Component({
    selector: 'fge-users',
    templateUrl: './users-listing.component.html'
})

export class UsersListgingComponent implements OnInit {
    userMock: Array<any>;
    configConfirmModal: any;
    currentUser: any;
    titleModalConfirm: string;
    messageConfirmModal: string;
    confirmModal: any;
    groups$: Observable<ApplicationContent[]>;
    loading$: Observable<boolean> | boolean;
    constructor(private store: Store<State>) { }

    ngOnInit() {
        this.initSelectors();

        // TODO removed when API listing is implemented.
        this.userMock = [
            {
                id: 1053,
                userName: 'fidel12',
                firstName: 'fidel',
                lastName: 'barcaya',
                email: 'dcanqui@hinda.com',
                isActive: true,
                groupApplication: 'Corporation',
                applicationPath: 'FIS LOYALTY SCORECARD PARTNER',
                applicationId: 3752
            },
            {
                id: 1037,
                userName: 'fidel',
                firstName: 'fidel',
                lastName: 'barcaya',
                email: 'dcanqui@hinda.com',
                isActive: false,
                groupApplication: 'Corporation',
                applicationPath: 'FIS LOYALTY SCORECARD PARTNER',
                applicationId: 3752
            },
            {
                id: 3038,
                login: 'fbarcaya',
                firstName: 'fidel',
                lastName: 'barcaya',
                email: 'dcanqui@hinda.com',
                isActive: true,
                groupApplication: 'Corporation',
                applicationPath: 'FIS LOYALTY SCORECARD PARTNER'
            }
        ];
    }

    private initSelectors() {
        this.loading$ = this.store.select(isLoadingGroups);
        this.groups$ = this.store.select(getGroups);
    }

    openModalConfirm(confirmModal: any, user: any): void {
        this.confirmModal = confirmModal;
        this.currentUser = user;
        const labelAction = user.isActive ? 'desactive' : 'active';
        this.titleModalConfirm = 'Active/Desactive user confirmation';
        this.messageConfirmModal = `Do you want to ${labelAction} the user ${user.userName}?`;
        confirmModal.open();
    }

    submit() {
        this.store.select(isUserUpdated).subscribe(() => {
            this.confirmModal.close();
        });

        this.store.dispatch(new UpdateUserAction({
            id: this.currentUser.id,
            firstName: this.currentUser.firstName,
            lastName: this.currentUser.lastName,
            emailAddress: this.currentUser.email,
            isActive: !this.currentUser.isActive,
        }));
    }
}
