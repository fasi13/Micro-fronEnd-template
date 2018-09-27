import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnauthLayoutComponent, AuthLayoutComponent, AuthorizedGuard } from '@forge/core';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [ AuthorizedGuard ],
    canActivateChild: [ AuthorizedGuard ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tenant/default'
      },
      {
        path: 'tenant/:tenantId',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'content'
          },
          {
            path: 'content',
            loadChildren: './content/content.module#ContentModule'
          }
        ]
      },
    ]
  }, {
    path: '',
    component: UnauthLayoutComponent,
    children: [
      { 
        path: '',
        loadChildren: './authorization/authorization.module#AuthorizationModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
