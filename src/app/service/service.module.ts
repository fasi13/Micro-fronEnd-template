import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { SharedModule } from '../shared/shared.module';
import { ServiceRolesGuard } from './_guards/service-roles.guard';
import { ServiceComponent } from './service.component';
import { ServiceScriptResolver } from './service-script-resolver';

const routes: Routes = [
 {
    path: '',
    canActivate: [ ServiceRolesGuard ],
    component: ServiceComponent,
    data: { hideLanguageSelector: true },
    resolve: { service: ServiceScriptResolver }
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
    ServiceComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServiceModule {}
