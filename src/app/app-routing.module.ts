import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnauthLayoutComponent, AuthLayoutComponent, AuthorizedGuard, TenantLayoutComponent } from '@forge/core';
import { ResetPasswordComponent } from '@forge/shared';

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
            component: TenantLayoutComponent,
            children: [
              {
                path: 'content',
                loadChildren: './content/content.module#ContentModule'
              },
              {
                path: 'user',
                loadChildren: './user/user.module#UserModule'
              },
              {
                path: 'reset-password',
                component: ResetPasswordComponent
              },
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'content'
              }
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
  }, {
    path: '',
    component: UnauthLayoutComponent,
    children: [
      {
        path: 'error',
        loadChildren: './error/error.module#ErrorModule'
      },
      {
        path: '',
        loadChildren: './authorization/authorization.module#AuthorizationModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
