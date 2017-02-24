import {Injectable} from '@angular/core';

import {ApplicationSummary} from './application-summary.model';

@Injectable()
export class ApplicationService {
    applications: ApplicationSummary[] = [
        {key: "111", name: "some app 1"},
        {key: "222", name: "some app 2"}
    ];

    getApplications(): Promise<ApplicationSummary[]> {
        return Promise.resolve(this.applications);
    }
}