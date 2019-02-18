import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { UsersListingComponent } from './users-listing/users-listing.component';
import { UserFormModalComponent } from './shared/user-form-modal/user-form-modal.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UsersListingGuard } from './_guards/users-listing.guard';

const routes: Routes = [
  { path: '', redirectTo: 'list' },
  {
    path: 'list',
    canActivate: [UsersListingGuard],
    component: UsersListingComponent
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
  declarations: [UsersListingComponent, UserFormModalComponent]
})
export class UserModule {}
