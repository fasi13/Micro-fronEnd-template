import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, UrlSegment } from '@angular/router';

import {
  AuthLayoutComponent,
  AuthorizedGuard,
  TenantLayoutComponent,
  TenantGuard
} from '@forge/core';
import { ResetPasswordComponent } from '@forge/shared';
import { ComingSoonComponent } from './shared/components/coming-soon/coming-soon.component';

export function serviceMatcherFunction(url: UrlSegment[]) {
  if (url.length >= 1) {
    if(url[0].path == 'service'){
      return {consumed: url};
    }
  }
  return null;
}

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [AuthorizedGuard],
    children: [
      {
        path: 'tenant',
        children: [
          {
            path: ':tenantId',
            canActivate: [TenantGuard],
            component: TenantLayoutComponent,
            children: [
              {
                path: 'content',
                loadChildren: './content/content.module#ContentModule'
              },
              {
                path: 'report',
                loadChildren: './report/report.module#ReportModule'
              },
              {
                path: 'user',
                loadChildren: './user/user.module#UserModule'
              },
              { path: 'promotions', component: ComingSoonComponent },
              { path: 'campaings', component: ComingSoonComponent },
              { path: 'reset-password', component: ResetPasswordComponent },
              {
                matcher: serviceMatcherFunction,
                loadChildren: './service/service.module#ServiceModule'
              },
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
  {
    path: '',
    loadChildren: './authorization/authorization.module#AuthorizationModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
      paramsInheritanceStrategy: 'always'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
