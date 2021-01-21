import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { SharedModule } from '../shared/shared.module';
import { CommunicationRolesGuard } from './_guards/communication-roles.guard';
import { CommunicationAppComponent } from './communication-app/communication-app.component';
import { CommunicationAppScriptResolver } from './communication-app-script-resolver';

const routes: Routes = [
 {
    path: '',
    canActivate: [ CommunicationRolesGuard ],
    component: CommunicationAppComponent,
    data: { hideLanguageSelector: true },
    resolve: { app: CommunicationAppScriptResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgBootstrapModule,
    SharedModule
  ],
  declarations: [
    CommunicationAppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommunicationModule {}
