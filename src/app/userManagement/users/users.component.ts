import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'fge-users',
    templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {
    userMock: Array<any>;
    ngOnInit() {
        this.userMock = [
            {
                userId: 1035,
                userName: 'danielcC',
                firstName: 'daniel',
                lastName: 'canqui',
                email: 'dcanqui@hinda.com',
                status: 'active',
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
                status: 'active',
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
                status: 'active',
                groupApplication: 'Corporation',
                applicationName: 'FIS LOYALTY SCORECARD PARTNER',
                applicationId: 3752
            }
        ];
    }
}
