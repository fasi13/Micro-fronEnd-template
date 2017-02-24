import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationSummary } from '../shared/application-summary.model';
import {ApplicationService} from '../shared/application.service';

@Component({
    moduleId: module.id,
    templateUrl: 'application-list.component.html',
    providers: [ApplicationService]
})
export class ApplicationListComponent implements OnInit {
    applications: ApplicationSummary[];

    constructor(
        private router: Router,
        private applicationService: ApplicationService
    ) { }

    ngOnInit(): void {
        this.applicationService.getApplications()
            .then(applications => this.applications = applications);
    }

    onEdit(application: ApplicationSummary): void {
        this.router.navigate(['applications/', application.key]);
    }
}
