import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { SharedModule } from '../shared/shared.module';
import { ServiceRolesGuard } from './_guards/service-roles.guard';
import { ServiceComponent } from './service.component';
import { ServiceScriptResolver } from './service-script-resolver';
import { StartServiceComponent } from './start-service.component';

export function serviceMatcherFunction(url: UrlSegment[]) {
  return {consumed: url};
}

const routes: Routes = [
  {
    path: 'start/:serviceName',
    component: StartServiceComponent
  },
 {
    matcher: serviceMatcherFunction,
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
    ServiceComponent,
    StartServiceComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServiceModule {}
