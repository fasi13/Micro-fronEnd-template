import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'fge-users',
    templateUrl: './users-listing.component.html'
})

export class UsersListgingComponent implements OnInit {
    userMock: Array<any>;

    ngOnInit() {
        // TODO removed when API listing is implemented.
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
}
