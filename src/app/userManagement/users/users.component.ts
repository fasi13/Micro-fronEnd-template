import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { UserFormModalComponent } from '../shared/user-form-modal/user-form-modal';

@Component({
    selector: 'fge-users',
    templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {
    userMock: Array<any>;
    modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal
    ) { }
    ngOnInit() {
        this.userMock = [
            {
                userId: 1053,
                userName: 'fidel12',
                firstName: 'fidel',
                lastName: 'barcaya',
                email: 'dcanqui@hinda.com',
                status: true,
                groupApplication: 'Corporation',
                applicationName: 'FIS LOYALTY SCORECARD PARTNER',
                applicationId: 3752
            },
            {
                userId: 1037,
                userName: 'fidel',
                firstName: 'fidel',
                lastName: 'barcaya',
                email: 'dcanqui@hinda.com',
                status: false,
                groupApplication: 'Corporation',
                applicationName: 'FIS LOYALTY SCORECARD PARTNER',
                applicationId: 3752
            },
            {
                userId: 3038,
                userName: 'fbarcaya',
                firstName: 'fidel',
                lastName: 'barcaya',
                email: 'dcanqui@hinda.com',
                status: true,
                groupApplication: 'Corporation',
                applicationName: 'FIS LOYALTY SCORECARD PARTNER',
                applicationId: 3752
            }
        ];
    }

    openContentForm(): void {
        this.modalRef = this.modalService.open(UserFormModalComponent);
    }
}
