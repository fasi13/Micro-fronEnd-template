import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  AuthLayoutComponent,
  AuthorizedGuard,
  TenantLayoutComponent,
  TenantGuard
} from '@forge/core';
import { ResetPasswordComponent } from '@forge/shared';
import { ComingSoonComponent } from './shared/components/coming-soon/coming-soon.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [ AuthorizedGuard ],
    canActivateChild: [ AuthorizedGuard ],
    children: [
      {
        path: 'tenant',
        children: [
          {
            path: ':tenantId',
            canActivate: [ TenantGuard ],
            component: TenantLayoutComponent,
            children: [
              { path: 'content', loadChildren: './content/content.module#ContentModule' },
              { path: 'user', loadChildren: './user/user.module#UserModule' },
              { path: 'promotions', component: ComingSoonComponent },
              { path: 'campaings', component: ComingSoonComponent },
              { path: 'settings', component: ComingSoonComponent },
              { path: 'reset-password', component: ResetPasswordComponent },
              { path: '', pathMatch: 'full', redirectTo: 'content' }
            ]
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'default'
          }
        ]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tenant'
      }
    ]
  },
  { path: 'error', loadChildren: './error/error.module#ErrorModule' },
  { path: '', loadChildren: './authorization/authorization.module#AuthorizationModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
