import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { UsersListingComponent } from './users-listing/users-listing.component';
import { UserFormModalComponent } from './shared/user-form-modal/user-form-modal.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UsersListingGuard } from './_guards/users-listing.guard';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { RoleFormModalComponent } from './shared/role-form-modal/role-form-modal.component';
import { RolePermissionsComponent } from './shared/role-permissions/role-permissions.component';
import { RoleUsersComponent } from './shared/role-users/role-users.component';
import { UserRolesGuard } from './_guards/user-roles.guard';

const routes: Routes = [
  { path: '', redirectTo: 'list' },
  {
    path: 'list',
    canActivate: [UsersListingGuard],
    component: UsersListingComponent
  }, {
    path: 'roles',
    canActivate: [ UserRolesGuard ],
    component: UserRolesComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    NgBootstrapModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    UsersListingComponent,
    UserFormModalComponent,
    UserRolesComponent,
    RoleFormModalComponent,
    RolePermissionsComponent,
    RoleUsersComponent
  ]
})
export class UserModule {}
