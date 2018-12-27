import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { UsersListgingComponent } from './users-listing/users-listing.component';
import { UserFormModalComponent } from './shared/user-form-modal/user-form-modal.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ApplicationPathPipe } from './shared/application-path.pipe';

const routes: Routes = [
  { path: '', redirectTo: 'list' },
  { path: 'list', component: UsersListgingComponent }
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
  declarations: [ UsersListgingComponent, UserFormModalComponent, ApplicationPathPipe ]
})
export class UserModule { }
