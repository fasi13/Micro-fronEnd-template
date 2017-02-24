import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationComponent } from './application/application.component';

@NgModule({
    imports: [CommonModule, ApplicationsRoutingModule],
    declarations: [ApplicationListComponent, ApplicationComponent],
    exports: [ApplicationListComponent, ApplicationComponent]
})
export class ApplicationsModule {

}