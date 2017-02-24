import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicationListComponent } from './application-list/application-list.component'
import { ApplicationComponent } from './application/application.component'

const routes: Routes = [
    { path: 'applications', component: ApplicationListComponent },
    { path: 'applications/:key', component: ApplicationComponent }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class ApplicationsRoutingModule {}